import {  IUserSubscriptionWithPlan } from '../../../../application/dtos/subscription_dto'
import { IUserSubscriptionEntity } from '../../../models/user_subscription_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface IUserSubscriptionRepository extends IBaseRepository<IUserSubscriptionEntity> {
  getMySubscriptionPlans(userId: string): Promise<IUserSubscriptionWithPlan[]>
}
