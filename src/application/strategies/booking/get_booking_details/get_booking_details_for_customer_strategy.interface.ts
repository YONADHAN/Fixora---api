import {
  GetBookingDetailsForCustomerStrategyResponseDTO,
  GetBookingDetailsRequestDTO,
} from '../../../dtos/booking_dto'

export interface IGetBookingDetailsForCustomerStrategy {
  execute(
    payload: GetBookingDetailsRequestDTO
  ): Promise<GetBookingDetailsForCustomerStrategyResponseDTO>
}
