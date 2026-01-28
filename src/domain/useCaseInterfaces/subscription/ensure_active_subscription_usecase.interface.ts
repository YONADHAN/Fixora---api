import { IUserSubscriptionEntity } from '../../models/user_subscription_entity'

export interface IEnsureActiveSubscriptionUseCase {
  execute(userId: string, role: string): Promise<IUserSubscriptionEntity | null>
}
