import { inject, injectable } from 'tsyringe'
import { CustomError } from '../../../domain/utils/custom.error'
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  ROLES,
  TRole,
} from '../../../shared/constants'
import { ICreateSubscriptionCheckoutFactory } from './create_subscription_checkout_factory.interface'

import { ICreateSubscriptionCheckoutStrategy } from '../../strategies/subscription/create_subscription_checkout_strategy.ts/create_subscription_checkout_strategy.interface'

import { ICreateVendorSubscriptionCheckoutStrategy } from '../../strategies/subscription/create_subscription_checkout_strategy.ts/create_vendor_subscription_checkout_strategy.interface'
@injectable()
export class CreateSubscriptionCheckoutFactory implements ICreateSubscriptionCheckoutFactory {
  constructor(
    @inject('ICreateVendorSubscriptionCheckoutStrategy')
    private readonly _createSubscriptionCheckoutVendorStrategy: ICreateVendorSubscriptionCheckoutStrategy,
  ) {}

  getStrategy(role: TRole): ICreateSubscriptionCheckoutStrategy {
    switch (role) {
      case ROLES.VENDOR:
        return this._createSubscriptionCheckoutVendorStrategy
      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST,
        )
    }
  }
}
