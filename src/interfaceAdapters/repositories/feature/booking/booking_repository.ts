import { injectable } from 'tsyringe'
import { FilterQuery, PipelineStage, Types } from 'mongoose'

import { BaseRepository } from '../../base_repository'
import {
  BookingModel,
  IBookingModel,
} from '../../../database/mongoDb/models/booking_model'
import { ServiceModel } from '../../../database/mongoDb/models/service_model'

import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IBookingEntity } from '../../../../domain/models/booking_entity'
import { BookingMongoBase } from '../../../database/mongoDb/types/booking_mongo_base'
import { CustomError } from '../../../../domain/utils/custom.error'
import { BookingDashboardResponseDTO } from '../../../../application/dtos/dashboard_dto'
import {
  DATE_FORMAT_MAP,
  timeGranularityType,
} from '../../../../shared/constants'

@injectable()
export class BookingRepository
  extends BaseRepository<IBookingModel, IBookingEntity>
  implements IBookingRepository {
  constructor() {
    super(BookingModel)
  }

  private validateObjectId(id: string | undefined, fieldName: string): void {
    if (id && !Types.ObjectId.isValid(id)) {
      throw new CustomError(`Invalid ${fieldName}`, 400)
    }
  }

  protected toModel(entity: Partial<IBookingEntity>): Partial<IBookingModel> {
    this.validateObjectId(entity.serviceRef, 'serviceRef')
    this.validateObjectId(entity.vendorRef, 'vendorRef')
    this.validateObjectId(entity.customerRef, 'customerRef')
    this.validateObjectId(entity.paymentRef, 'paymentRef')
    this.validateObjectId(entity.cancelInfo?.cancelledByRef, 'cancelledByRef')

    return {
      bookingId: entity.bookingId,
      bookingGroupId: entity.bookingGroupId,

      serviceRef: entity.serviceRef
        ? new Types.ObjectId(entity.serviceRef)
        : undefined,

      vendorRef: entity.vendorRef
        ? new Types.ObjectId(entity.vendorRef)
        : undefined,

      customerRef: entity.customerRef
        ? new Types.ObjectId(entity.customerRef)
        : undefined,

      date: entity.date,
      addressId: entity.addressId,
      slotStart: entity.slotStart,
      slotEnd: entity.slotEnd,

      paymentRef: entity.paymentRef
        ? new Types.ObjectId(entity.paymentRef)
        : undefined,

      paymentStatus: entity.paymentStatus,
      serviceStatus: entity.serviceStatus,

      cancelInfo: entity.cancelInfo
        ? {
          cancelledByRole: entity.cancelInfo.cancelledByRole,
          cancelledByRef: entity.cancelInfo.cancelledByRef
            ? new Types.ObjectId(entity.cancelInfo.cancelledByRef)
            : undefined,
          reason: entity.cancelInfo.reason,
          cancelledAt: entity.cancelInfo.cancelledAt,
        }
        : undefined,
    }
  }

  protected toEntity(model: BookingMongoBase): IBookingEntity {
    return {
      _id: model._id.toString(),

      bookingId: model.bookingId,
      bookingGroupId: model.bookingGroupId,

      serviceRef: model.serviceRef.toString(),
      vendorRef: model.vendorRef.toString(),
      customerRef: model.customerRef.toString(),

      date: model.date,
      slotStart: model.slotStart,
      slotEnd: model.slotEnd,

      paymentRef: model.paymentRef?.toString(),

      paymentStatus: model.paymentStatus,
      serviceStatus: model.serviceStatus,

      cancelInfo: model.cancelInfo
        ? {
          cancelledByRole: model.cancelInfo.cancelledByRole,
          cancelledByRef: model.cancelInfo.cancelledByRef?.toString(),
          reason: model.cancelInfo.reason,
          cancelledAt: model.cancelInfo.cancelledAt,
        }
        : undefined,

      addressId: model.addressId,

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
  async getBookingById(bookingId: string): Promise<IBookingEntity | null> {
    if (Types.ObjectId.isValid(bookingId)) {
      const booking = await this.model
        .findById(bookingId)
        .lean<BookingMongoBase>()
      if (booking) return this.toEntity(booking)
    }

    const bookingByCustomId = await this.model
      .findOne({ bookingId: bookingId })
      .lean<BookingMongoBase>()

    return bookingByCustomId ? this.toEntity(bookingByCustomId) : null
  }

  async findConfirmedBookedSlotsForService(
    serviceRef: string,
    month: number,
    year: number,
  ): Promise<IBookingEntity[]> {
    this.validateObjectId(serviceRef, 'serviceRef')

    if (month < 0 || month > 11) {
      throw new Error(`Invalid month: ${month}. Must be between 0-11`)
    }

    if (year < 2000 || year > 2100) {
      throw new Error(`Invalid year: ${year}`)
    }

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

    const bookings = await this.model
      .find({
        serviceRef: new Types.ObjectId(serviceRef),
        serviceStatus: { $ne: 'cancelled' },
        paymentStatus: { $in: ['advance-paid', 'paid', 'fully-paid'] },
        slotStart: { $gte: startOfMonth },
        slotEnd: { $lte: endOfMonth },
      })
      .lean<BookingMongoBase[]>()

    return bookings.map((b) => this.toEntity(b))
  }


  async findBookingsForUser(
    page: number,
    limit: number,
    search: string = '',
    filters: FilterQuery<IBookingModel> = {},
  ): Promise<{
    data: IBookingEntity[]
    currentPage: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const matchStage: FilterQuery<IBookingModel> = {
      ...filters,
      ...(search
        ? {
          $or: [
            { bookingId: { $regex: search, $options: 'i' } },
            { bookingGroupId: { $regex: search, $options: 'i' } },
            { paymentStatus: { $regex: search, $options: 'i' } },
            { serviceStatus: { $regex: search, $options: 'i' } },
          ],
        }
        : {}),
    }

    const pipeline: any[] = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$bookingGroupId',
          doc: { $first: '$$ROOT' },
          slots: { $push: '$$ROOT' },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$doc', { slots: '$slots' }],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: ServiceModel.collection.name,
                localField: 'serviceRef',
                foreignField: '_id',
                as: 'service',
              },
            },
            {
              $unwind: {
                path: '$service',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $addFields: {
                serviceName: '$service.name',
              },
            },
            {
              $project: {
                service: 0,
              },
            },
          ],
          metadata: [{ $count: 'total' }],
        },
      },
    ]

    const [result] = await this.model.aggregate(pipeline)

    const data = result.data || []
    const totalCount = result.metadata[0]?.total || 0

    return {
      data: data.map((doc: any) => {
        const entity = this.toEntity(doc)
        entity.serviceName = doc.serviceName
        if (doc.slots && Array.isArray(doc.slots)) {
          entity.slots = doc.slots.map((slot: any) => this.toEntity(slot))
        }
        return entity
      }),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    }
  }

  async findCompletedBookingsForReview(
    customerRef: string,
    serviceRef: string,
  ): Promise<IBookingEntity[]> {
    this.validateObjectId(customerRef, 'customerRef')
    this.validateObjectId(serviceRef, 'serviceRef')

    const bookings = await this.model
      .find({
        customerRef: new Types.ObjectId(customerRef),
        serviceRef: new Types.ObjectId(serviceRef),
        serviceStatus: 'completed',
      })
      .lean<BookingMongoBase[]>()

    return bookings.map((b) => this.toEntity(b))
  }

  async getBookingDashboardAnalytics(params: {
    from: Date
    to: Date
    interval: timeGranularityType
    vendorRef?: string
    customerRef?: string
  }): Promise<BookingDashboardResponseDTO> {
    const matchStage: any = {
      createdAt: { $gte: params.from, $lte: params.to },
    }

    if (params.vendorRef) {
      matchStage.vendorRef = new Types.ObjectId(params.vendorRef)
    }

    if (params.customerRef) {
      matchStage.customerRef = new Types.ObjectId(params.customerRef)
    }

    const [result] = await this.model.aggregate([
      { $match: matchStage },

      {
        $facet: {
          bookingGrowth: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: DATE_FORMAT_MAP[params.interval],
                    date: '$createdAt',
                  },
                },
                totalBookings: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
            {
              $project: {
                _id: 0,
                label: '$_id',
                totalBookings: 1,
              },
            },
          ],

          bookingStatusBreakdown: [
            {
              $group: {
                _id: '$serviceStatus',
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ])

    const statusMap = {
      scheduled: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
    }

    for (const item of result.bookingStatusBreakdown) {
      if (item._id === 'in-progress') {
        statusMap.inProgress = item.count
      } else {
        statusMap[item._id as keyof typeof statusMap] = item.count
      }
    }

    return {
      bookingGrowth: result.bookingGrowth,
      bookingStatusBreakdown: statusMap,
    }
  }

  async countUniqueCustomersForVendor(vendorRef: string): Promise<number> {
    this.validateObjectId(vendorRef, 'vendorRef')

    const result = await this.model.aggregate([
      {
        $match: {
          vendorRef: new Types.ObjectId(vendorRef),
        },
      },
      {
        $group: {
          _id: '$customerRef',
        },
      },
      {
        $count: 'totalUniqueCustomers',
      },
    ])

    return result[0]?.totalUniqueCustomers || 0
  }

  async countUniqueServicesForCustomer(customerRef: string): Promise<number> {
    this.validateObjectId(customerRef, 'customerRef')

    const result = await this.model.aggregate([
      {
        $match: {
          customerRef: new Types.ObjectId(customerRef),
        },
      },
      {
        $group: {
          _id: '$serviceRef',
        },
      },
      {
        $count: 'totalUniqueServices',
      },
    ])
    return result[0]?.totalUniqueServices || 0
  }

  async getAllServicesWhichCompletedBookings(
    customerRef: string,
    page: number,
    limit: number,
    search?: string,
    sortBy: 'createdAt' | 'serviceName' = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<{
    data: IBookingEntity[]
    totalPages: number
    currentPage: number
  }> {
    this.validateObjectId(customerRef, 'customerRef')

    const skip = (page - 1) * limit
    const sortDirection = sortOrder === 'asc' ? 1 : -1

    const pipeline: PipelineStage[] = [
      {
        $match: {
          customerRef: new Types.ObjectId(customerRef),
          serviceStatus: 'completed',
          paymentStatus: { $in: ['paid', 'fully-paid'] },
        },
      },
      { $sort: { createdAt: -1 } },

      {
        $group: {
          _id: '$serviceRef',
          latestBooking: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$latestBooking' } },

      //  join service
      {
        $lookup: {
          from: ServiceModel.collection.name,
          localField: 'serviceRef',
          foreignField: '_id',
          as: 'service',
        },
      },
      {
        $unwind: {
          path: '$service',
          preserveNullAndEmptyArrays: true,
        },
      },

      ...(search
        ? [
          {
            $match: {
              'service.name': { $regex: search, $options: 'i' },
            },
          },
        ]
        : []),

      {
        $sort:
          sortBy === 'serviceName'
            ? { 'service.name': sortDirection }
            : { createdAt: sortDirection },
      },

      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $addFields: {
                serviceName: '$service.name',
                serviceId: '$service.serviceId',
                mainImage: '$service.mainImage',
              },
            },
            {
              $project: {
                service: 0,
              },
            },
          ],
          metadata: [{ $count: 'total' }],
        },
      },
    ]

    const [result] = await this.model.aggregate(pipeline)

    const data = result.data || []
    const totalCount = result.metadata[0]?.total || 0

    return {
      data: data.map((doc: any) => {
        const entity = this.toEntity(doc)
        entity.serviceName = doc.serviceName
        entity.serviceId = doc.serviceId
        entity.mainImage = doc.mainImage
        return entity
      }),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    }
  }
}
