import { injectable } from 'tsyringe'
import {
  AdminRevenueModel,
  IAdminRevenueModel,
} from '../../../database/mongoDb/models/admin_revenue_model'

import { BaseRepository } from '../../base_repository'

import { IAdminRevenueEntity } from '../../../../domain/models/admin_revenue_entity'

import { AdminRevenueMongoBase } from '../../../database/mongoDb/types/admin_revenue_mongo_base'

import { IAdminRevenueRepository } from '../../../../domain/repositoryInterfaces/feature/payment/admin_revenue_repository.interface'

@injectable()
export class AdminRevenueRepository
  extends BaseRepository<IAdminRevenueModel, IAdminRevenueEntity>
  implements IAdminRevenueRepository
{
  constructor() {
    super(AdminRevenueModel)
  }

  protected toModel(
    entity: Partial<IAdminRevenueEntity>,
  ): Partial<IAdminRevenueModel> {
    return {
      revenueId: entity.revenueId,
      source: entity.source,
      referenceId: entity.referenceId,
      amount: entity.amount,
      currency: entity.currency,
    }
  }

  protected toEntity(model: AdminRevenueMongoBase): IAdminRevenueEntity {
    return {
      _id: model._id.toString(),
      revenueId: model.revenueId,
      source: model.source,
      referenceId: model.referenceId,
      amount: model.amount,
      currency: model.currency,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  async getTotalRevenue(): Promise<number> {
    const result = await this.model.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ])

    return result[0]?.total || 0
  }

  async getRevenueBySource(source: string): Promise<number> {
    const result = await this.model.aggregate([
      {
        $match: { source },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ])

    return result[0]?.total || 0
  }

  async getTotalRevenueByDateRange(from: Date, to: Date): Promise<number> {
  const result = await this.model.aggregate([
    {
      $match: {
        createdAt: {
          $gte: from,
          $lte: to,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ])

  return result[0]?.total || 0
}
}