import { injectable } from 'tsyringe'

import { BaseRepository } from '../../base_repository'
import {
  SubscriptionPlanModel,
  ISubscriptionPlanModel,
} from '../../../database/mongoDb/models/subscription_plan.model'
import { ISubscriptionPlanEntity } from '../../../../domain/models/subscription_plan_entity'
import { SubscriptionPlanMongoBase } from '../../../database/mongoDb/types/subscription_plan_mongo_base'
import { ISubscriptionPlanRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/subscription_plan.interface'
export type SubscriptionPlanPersistenceInput =
  Partial<ISubscriptionPlanEntity> & {
    stripeProductId: string
    stripePriceId: string
  }

@injectable()
export class SubscriptionPlanRepository
  extends BaseRepository<ISubscriptionPlanModel, ISubscriptionPlanEntity>
  implements ISubscriptionPlanRepository
{
  constructor() {
    super(SubscriptionPlanModel)
  }

  protected toEntity(
    model: SubscriptionPlanMongoBase,
  ): ISubscriptionPlanEntity {
    return {
      _id: model._id.toString(),

      planId: model.planId,
      name: model.name,
      description: model.description,

      price: model.price,
      currency: model.currency,
      durationInDays: model.durationInDays,

      features: model.features,

      benefits: model.benefits,
      stripeProductId: model.stripePriceId,
      stripePriceId: model.stripePriceId,

      isActive: model.isActive,
      createdByAdminId: model.createdByAdminId,

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  protected toModel(
    entity: Partial<ISubscriptionPlanEntity> & {
      stripeProductId?: string
      stripePriceId?: string
    },
  ): Partial<ISubscriptionPlanModel> {
    return {
      planId: entity.planId,
      name: entity.name,
      description: entity.description,

      price: entity.price,
      currency: entity.currency,
      durationInDays: entity.durationInDays,

      stripeProductId: entity.stripeProductId,
      stripePriceId: entity.stripePriceId,

      features: entity.features,
      benefits: entity.benefits ?? [],

      isActive: entity.isActive ?? true,
      createdByAdminId: entity.createdByAdminId,
    }
  }

  async create(
    data: SubscriptionPlanPersistenceInput,
  ): Promise<ISubscriptionPlanEntity> {
    const created = await this.model.create(this.toModel(data))
    return this.toEntity(created)
  }
}
