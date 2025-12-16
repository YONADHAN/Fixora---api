import { injectable } from 'tsyringe'
import { Types } from 'mongoose'

import { BaseRepository } from '../../base_repository'
import {
  BookingModel,
  IBookingModel,
} from '../../../database/mongoDb/models/booking_model'

import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IBookingEntity } from '../../../../domain/models/booking_entity'
import { BookingMongoBase } from '../../../database/mongoDb/types/booking_mongo_base'
import { CustomError } from '../../../../domain/utils/custom.error'

@injectable()
export class BookingRepository
  extends BaseRepository<IBookingModel, IBookingEntity>
  implements IBookingRepository
{
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

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
  async findConfirmedBookedSlotsForService(
    serviceRef: string,
    month: number,
    year: number
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
        paymentStatus: { $in: ['advance-paid', 'paid'] },
        slotStart: { $gte: startOfMonth },
        slotEnd: { $lte: endOfMonth },
      })
      .lean<BookingMongoBase[]>()

    return bookings.map((b) => this.toEntity(b))
  }
}
