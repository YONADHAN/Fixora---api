import { inject, injectable } from 'tsyringe'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import {
  GetBookingDetailsForCustomerStrategyResponseDTO,
  GetBookingDetailsForVendorStrategyResponseDTO,
  GetBookingDetailsRequestDTO,
} from '../../dtos/booking_dto'
import { IGetBookingDetailsFactory } from './get_booking_details_factory.interface'
import { IGetBookingDetailsForCustomerStrategy } from '../../strategies/booking/get_booking_details/get_booking_details_for_customer_strategy.interface'
import { IGetBookingDetailsForVendorStrategy } from '../../strategies/booking/get_booking_details/get_booking_details_for_vendor_strategy.interface'

@injectable()
export class GetBookingDetailsFactory implements IGetBookingDetailsFactory {
  constructor(
    @inject('IGetBookingDetailsForCustomerStrategy')
    private readonly _getBookingDetailsStrategyForCustomer: IGetBookingDetailsForCustomerStrategy,
    @inject('IGetBookingDetailsForVendorStrategy')
    private readonly _getBookingDetailsStrategyForVendor: IGetBookingDetailsForVendorStrategy
  ) {}
  async getStrategy(
    payload: GetBookingDetailsRequestDTO
  ): Promise<
    | GetBookingDetailsForVendorStrategyResponseDTO
    | GetBookingDetailsForCustomerStrategyResponseDTO
  > {
    switch (payload.role) {
      case 'customer':
        return await this._getBookingDetailsStrategyForCustomer.execute(payload)
      case 'vendor':
        return await this._getBookingDetailsStrategyForVendor.execute(payload)

      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.UNAUTHORIZED
        )
    }
  }
}
