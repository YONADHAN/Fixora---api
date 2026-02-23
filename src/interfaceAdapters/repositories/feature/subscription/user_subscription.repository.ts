import { injectable } from 'tsyringe'

import { BaseRepository } from '../../base_repository'
import {
  UserSubscriptionModel,
  IUserSubscriptionModel,
} from '../../../database/mongoDb/models/user_subscription.model'
import { IUserSubscriptionEntity } from '../../../../domain/models/user_subscription_entity'
import { UserSubscriptionMongoBase } from '../../../database/mongoDb/types/user_subscription_mongo_base'
import { IUserSubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface'

@injectable()
export class UserSubscriptionRepository
  extends BaseRepository<IUserSubscriptionModel, IUserSubscriptionEntity>
  implements IUserSubscriptionRepository
{
  constructor() {
    super(UserSubscriptionModel)
  }

  protected toEntity(
    model: UserSubscriptionMongoBase,
  ): IUserSubscriptionEntity {
    return {
      _id: model._id.toString(),

      subscriptionId: model.subscriptionId,
      userId: model.userId,
      userRole: model.userRole,

      subscriptionPlanId: model.subscriptionPlanId,
      stripeCheckoutSessionId: model.stripeCheckoutSessionId,
      stripeSubscriptionId: model.stripeSubscriptionId,

      startDate: model.startDate,
      endDate: model.endDate,

      status: model.status,
      autoRenew: model.autoRenew,

      paymentProvider: model.paymentProvider,
      paymentId: model.paymentId,
      paymentStatus: model.paymentStatus,

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  protected toModel(
    entity: Partial<IUserSubscriptionEntity>,
  ): Partial<IUserSubscriptionModel> {
    return {
      subscriptionId: entity.subscriptionId,
      userId: entity.userId,
      userRole: entity.userRole,

      subscriptionPlanId: entity.subscriptionPlanId,

      stripeCheckoutSessionId: entity.stripeCheckoutSessionId,
      stripeSubscriptionId: entity.stripeSubscriptionId,

      startDate: entity.startDate,
      endDate: entity.endDate,

      status: entity.status ?? 'pending',
      autoRenew: entity.autoRenew ?? false,

      paymentProvider: entity.paymentProvider,
      paymentId: entity.paymentId,
      paymentStatus: entity.paymentStatus ?? 'initiated',
    }
  }
}
