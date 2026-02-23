import { TRole } from '../../../shared/constants'

import { ICreateSubscriptionCheckoutStrategy } from '../../strategies/subscription/create_subscription_checkout_strategy.ts/create_subscription_checkout_strategy.interface'

export interface ICreateSubscriptionCheckoutFactory {
  getStrategy(role: TRole): ICreateSubscriptionCheckoutStrategy
}
