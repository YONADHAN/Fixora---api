import { SubscriptionPlanPersistenceInput } from '../../../../interfaceAdapters/repositories/feature/subscription/subscription_plan.repository'
import { ISubscriptionPlanEntity } from '../../../models/subscription_plan_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface ISubscriptionPlanRepository extends IBaseRepository<ISubscriptionPlanEntity> {
  create(
    data: SubscriptionPlanPersistenceInput,
  ): Promise<ISubscriptionPlanEntity>
}
