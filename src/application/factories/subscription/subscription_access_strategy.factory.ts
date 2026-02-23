import { injectable, inject } from 'tsyringe'
import { ROLES } from '../../../shared/constants'
import { IEnsureActiveSubscriptionStrategy } from '../../strategies/subscription/subscription_access_strategy/enusure_active_subscription_access_strategy.interface'
import { ISubscriptionAccessStrategyFactory } from './subscription_access_strategy_factory.interface'

@injectable()
export class SubscriptionAccessStrategyFactory implements ISubscriptionAccessStrategyFactory {
  constructor(
    @inject('VendorSubscriptionStrategy')
    private readonly vendorStrategy: IEnsureActiveSubscriptionStrategy,
  ) {}

  getStrategy(role: string): IEnsureActiveSubscriptionStrategy | null {
    switch (role) {
      case ROLES.VENDOR:
        return this.vendorStrategy
      default:
        return null
    }
  }
}
