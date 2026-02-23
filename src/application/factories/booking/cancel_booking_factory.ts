import { inject, injectable } from 'tsyringe'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import { CancelBookingRequestDTO } from '../../dtos/booking_dto'
import { ICancelBookingFactory } from './cancel_booking_factory.interface'
import { IVendorCancelBookingStrategyInterface } from '../../strategies/booking/cancel_bookings/vendor_cancel_booking_strategy.interface'
import { ICustomerCancelBookingStrategyInterface } from '../../strategies/booking/cancel_bookings/customer_cancel_booking_strategy.interface'

@injectable()
export class CancelBookingFactory implements ICancelBookingFactory {
  constructor(
    @inject('ICustomerCancelBookingStrategyInterface')
    private _customerCancelBookingStrategy: ICustomerCancelBookingStrategyInterface,
    @inject('IVendorCancelBookingStrategyInterface')
    private _vendorCancelBookingStrategy: IVendorCancelBookingStrategyInterface
  ) {}
  async getStrategy(payload: CancelBookingRequestDTO): Promise<void> {
    switch (payload.role) {
      case 'customer':
        return await this._customerCancelBookingStrategy.execute(payload)
      case 'vendor':
        return await this._vendorCancelBookingStrategy.execute(payload)

      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.BAD_REQUEST
        )
    }
  }
}
