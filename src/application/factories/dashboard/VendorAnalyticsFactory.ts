import { inject, injectable } from 'tsyringe'

import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  ROLES,
  TRole,
} from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { IVendorAnalyticsFactory } from './IVendorAnalyticsFactory'
import { VendorAnalyticsStrategyForAdmin } from '../../strategies/dashboard/vendor/VendorAnalyticsStrategyForAdmin'
import { IVendorAnalyticsStrategy } from '../../strategies/dashboard/vendor/IVendorAnalyticsStrategy'

@injectable()
export class VendorAnalyticsFactory implements IVendorAnalyticsFactory {
  constructor(
    @inject('VendorAnalyticsStrategyForAdmin')
    private readonly _vendorStrategyForAdmin: VendorAnalyticsStrategyForAdmin,
  ) { }
  getStrategy(role: TRole): IVendorAnalyticsStrategy {
    switch (role) {
      case ROLES.ADMIN:
        return this._vendorStrategyForAdmin

      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST,
        )
    }
  }
}
