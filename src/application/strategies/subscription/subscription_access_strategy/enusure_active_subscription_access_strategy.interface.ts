import { IUserSubscriptionEntity } from '../../../../domain/models/user_subscription_entity'

export interface IEnsureActiveSubscriptionStrategy {
  execute(userId: string): Promise<IUserSubscriptionEntity>
}
