import { inject, injectable } from 'tsyringe'
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  ROLES,
  TRole,
} from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { IBookingAnalyticsFactory } from './IBookingAnalyticsFactory'
import { IBookingAnalyticsStrategy } from '../../strategies/dashboard/booking/IBookingAnalyticsStrategy'
import { BookingAnalyticsStrategyForAdmin } from '../../strategies/dashboard/booking/BookingAnalyticsStrategyForAdmin'
import { BookingAnalyticsStrategyForVendor } from '../../strategies/dashboard/booking/BookingAnalyticsStrategyForVendor'
import { BookingAnalytisStrategyForCustomer } from '../../strategies/dashboard/booking/BookingAnalyticsStrategyForCustomer'

@injectable()
export class BookingAnalyticsFactory implements IBookingAnalyticsFactory {
  constructor(
    @inject('BookingAnalyticsStrategyForAdmin')
    private readonly _bookingStrategyForAdmin: BookingAnalyticsStrategyForAdmin,
    @inject('BookingAnalyticsStrategyForVendor')
    private readonly _bookingStrategyForVendor: BookingAnalyticsStrategyForVendor,
    @inject('BookingAnalytisStrategyForCustomer')
    private readonly _bookingStrategyForCustomer: BookingAnalytisStrategyForCustomer,
  ) {}

  getStrategy(role: TRole): IBookingAnalyticsStrategy {
    switch (role) {
      case ROLES.ADMIN:
        return this._bookingStrategyForAdmin

      case ROLES.VENDOR:
        return this._bookingStrategyForVendor

      case ROLES.CUSTOMER:
      
        return this._bookingStrategyForCustomer

      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST,
        )
    }
  }
}
