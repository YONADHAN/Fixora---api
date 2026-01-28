import { IEnsureActiveSubscriptionStrategy } from '../../strategies/subscription/subscription_access_strategy/enusure_active_subscription_access_strategy.interface'

export interface ISubscriptionAccessStrategyFactory {
  getStrategy(role: string): IEnsureActiveSubscriptionStrategy | null
}
