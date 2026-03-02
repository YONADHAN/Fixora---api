import { inject, injectable } from 'tsyringe'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS} from '../../../shared/constants'
import { IGetBookingsFactory } from './get_booking_factory.interface'
import {
  GetBookingRequestDTO,
  GetBookingResponseDTO,
} from '../../dtos/booking_dto'
import { IGetBookingForAdminStrategyInterface } from '../../strategies/booking/get_bookings/get_booking_for_admin_strategy.interface'
import { IGetBookingForVendorStrategyInterface } from '../../strategies/booking/get_bookings/get_booking_for_vendor_strategy.interface'
import { IGetBookingForCustomerStrategyInterface } from '../../strategies/booking/get_bookings/get_booking_for_customer_strategy.interface'

@injectable()
export class GetBookingsFactory implements IGetBookingsFactory {
  constructor(
    @inject('IGetBookingForCustomerStrategyInterface')
    private _getBookingForCustomerStrategy: IGetBookingForCustomerStrategyInterface,
    @inject('IGetBookingForVendorStrategyInterface')
    private _getBookingForVendorStrategy: IGetBookingForVendorStrategyInterface,
    @inject('IGetBookingForAdminStrategyInterface')
    private _getBookingForAdminStrategy: IGetBookingForAdminStrategyInterface
  ) {}

  async getStrategy(dto: GetBookingRequestDTO): Promise<GetBookingResponseDTO> {
    switch (dto.role) {
      case 'customer':
        return this._getBookingForCustomerStrategy.strategy(dto)
      case 'vendor':
        return this._getBookingForVendorStrategy.strategy(dto)
      case 'admin':
        return this._getBookingForAdminStrategy.strategy(dto)
      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST
        )
    }
  }
}
