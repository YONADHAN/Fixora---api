import { injectable } from 'tsyringe'

import { BaseRepository } from '../../base_repository'
import {
  UserSubscriptionModel,
  IUserSubscriptionModel,
} from '../../../database/mongoDb/models/user_subscription.model'
import { IUserSubscriptionEntity } from '../../../../domain/models/user_subscription_entity'
import { UserSubscriptionMongoBase } from '../../../database/mongoDb/types/user_subscription_mongo_base'
import { IUserSubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface'
import {  IUserSubscriptionWithPlan } from '../../../../application/dtos/subscription_dto'

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

 async getMySubscriptionPlans(userId: string): Promise<IUserSubscriptionWithPlan[]> {
  const result = await this.model.aggregate([
    {
      $match: {
        userId: userId,
        status: 'active',
      },
    },
    {
      $lookup: {
        from: 'subscriptionplans',
        localField: 'subscriptionPlanId',
        foreignField: 'planId',
        as: 'planDetails',
      },
    },
    {
      $unwind: {
        path: '$planDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        subscriptionId: 1,
        userId: 1,
        userRole: 1,
        status: 1,
        startDate: 1,
        endDate: 1,
        autoRenew: 1,
        paymentStatus: 1,

        plan: {
          planId: '$planDetails.planId',
          name: '$planDetails.name',
          description: '$planDetails.description',
          price: '$planDetails.price',
          durationInDays: '$planDetails.durationInDays',
          features: '$planDetails.features',
          benefits: '$planDetails.benefits',
        },
      },
    },
  ])

  return result as IUserSubscriptionWithPlan[]
}
}
