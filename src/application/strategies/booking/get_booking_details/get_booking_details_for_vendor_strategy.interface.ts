import {
  GetBookingDetailsForVendorStrategyResponseDTO,
  GetBookingDetailsRequestDTO,
} from '../../../dtos/booking_dto'

export interface IGetBookingDetailsForVendorStrategy {
  execute(
    payload: GetBookingDetailsRequestDTO
  ): Promise<GetBookingDetailsForVendorStrategyResponseDTO>
}
