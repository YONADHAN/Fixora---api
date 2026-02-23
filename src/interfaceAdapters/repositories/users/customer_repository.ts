import { injectable } from 'tsyringe'
import { BaseRepository } from '../base_repository'
import {
  CustomerModel,
  ICustomerModel,
} from '../../database/mongoDb/models/customer_model'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { ICustomerEntity } from '../../../domain/models/customer_entity'

import { timeGranularityType } from '../../../shared/constants'
import { CustomerDashboardResponseDTO } from '../../../application/dtos/dashboard_dto'
import { Types } from 'mongoose'
type CustomerStatus = 'active' | 'blocked'

interface CustomerStatusAggregation {
  _id: CustomerStatus
  count: number
}

interface CustomerDashboardAggregationResult {
  customerGrowth: {
    label: string
    totalCustomers: number
  }[]
  customerStatusBreakdown: CustomerStatusAggregation[]
}

const DATE_FORMAT_MAP: Record<timeGranularityType, string> = {
  daily: '%Y-%m-%d',
  weekly: '%Y-%U',
  monthly: '%Y-%m',
  yearly: '%Y',
}

function normalizeCustomerResult(
  result: CustomerDashboardAggregationResult,
): CustomerDashboardResponseDTO {
  const statusMap: Record<CustomerStatus, number> = {
    active: 0,
    blocked: 0,
  }

  for (const item of result.customerStatusBreakdown) {
    statusMap[item._id] = item.count
  }

  return {
    customerGrowth: result.customerGrowth,
    customerStatusBreakdown: statusMap,
  }
}

@injectable()
export class CustomerRepository
  extends BaseRepository<ICustomerModel, ICustomerEntity>
  implements ICustomerRepository
{
  constructor() {
    super(CustomerModel)
  }

  protected toEntity(model: ICustomerModel): ICustomerEntity {
    return {
      userId: model.userId,
      _id: model._id,

      name: model.name,
      email: model.email,
      phone: model.phone,
      password: model.password,
      role: model.role,
      status: model.status,

      googleId: model.googleId,
      profileImage: model.profileImage,

      geoLocation: model.geoLocation
        ? {
            type: model.geoLocation.type,
            coordinates: model.geoLocation.coordinates,
          }
        : undefined,

      location: model.location
        ? {
            name: model.location.name,
            displayName: model.location.displayName,
            zipCode: model.location.zipCode,
          }
        : undefined,

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  protected toModel(entity: Partial<ICustomerEntity>): Partial<ICustomerModel> {
    return {
      userId: entity.userId,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      password: entity.password,
      role: entity.role,
      status: entity.status,

      googleId: entity.googleId,
      profileImage: entity.profileImage,

      geoLocation: entity.geoLocation
        ? {
            type: entity.geoLocation.type,
            coordinates: entity.geoLocation.coordinates,
          }
        : undefined,

      location: entity.location
        ? {
            name: entity.location.name,
            displayName: entity.location.displayName,
            zipCode: entity.location.zipCode,
          }
        : undefined,
    }
  }
  async getCustomerDashboardAnalytics(params: {
    from: Date
    to: Date
    interval: timeGranularityType
    vendorRef?: string
  }): Promise<CustomerDashboardResponseDTO> {
    if (params.vendorRef) {
      return this.getVendorCustomerDashboardAnalytics({
        from: params.from,
        to: params.to,
        interval: params.interval,
        vendorRef: params.vendorRef,
      })
    }

    return this.getAdminCustomerDashboardAnalytics({
      from: params.from,
      to: params.to,
      interval: params.interval,
    })
  }
  private async getAdminCustomerDashboardAnalytics(params: {
    from: Date
    to: Date
    interval: timeGranularityType
  }): Promise<CustomerDashboardResponseDTO> {
    const [result] = await this.model.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: DATE_FORMAT_MAP[params.interval],
              date: '$createdAt',
            },
          },
          totalCustomers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },

      {
        $group: {
          _id: null,
          growth: {
            $push: {
              label: '$_id',
              totalCustomers: '$totalCustomers',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          customerGrowth: {
            $reduce: {
              input: '$growth',
              initialValue: [],
              in: {
                $concatArrays: [
                  '$$value',
                  [
                    {
                      label: '$$this.label',
                      totalCustomers: {
                        $add: [
                          '$$this.totalCustomers',
                          {
                            $ifNull: [{ $last: '$$value.totalCustomers' }, 0],
                          },
                        ],
                      },
                    },
                  ],
                ],
              },
            },
          },
        },
      },

      {
        $lookup: {
          from: 'customers',
          pipeline: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
          ],
          as: 'customerStatusBreakdown',
        },
      },
    ])

    return normalizeCustomerResult({
      customerGrowth: result?.customerGrowth ?? [],
      customerStatusBreakdown: result?.customerStatusBreakdown ?? [],
    })
  }

  private async getVendorCustomerDashboardAnalytics(params: {
    from: Date
    to: Date
    interval: timeGranularityType
    vendorRef: string
  }): Promise<CustomerDashboardResponseDTO> {
    const [result] = await this.model.db
      .collection('bookings')
      .aggregate([
        {
          $match: {
            vendorRef: new Types.ObjectId(params.vendorRef),
            createdAt: { $gte: params.from, $lte: params.to },
          },
        },

        {
          $lookup: {
            from: 'customers',
            localField: 'customerRef',
            foreignField: '_id',
            as: 'customer',
          },
        },
        { $unwind: '$customer' },

        {
          $group: {
            _id: '$customer._id',
            customer: { $first: '$customer' },
          },
        },

        {
          $facet: {
            customerGrowth: [
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: DATE_FORMAT_MAP[params.interval],
                      date: '$customer.createdAt',
                    },
                  },
                  totalCustomers: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
              { $project: { _id: 0, label: '$_id', totalCustomers: 1 } },
            ],

            customerStatusBreakdown: [
              {
                $group: {
                  _id: '$customer.status',
                  count: { $sum: 1 },
                },
              },
            ],
          },
        },
      ])
      .toArray()

    return normalizeCustomerResult(
      result as unknown as CustomerDashboardAggregationResult,
    )
  }
}
