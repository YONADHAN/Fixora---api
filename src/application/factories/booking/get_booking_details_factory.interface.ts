import {
  GetBookingDetailsForCustomerStrategyResponseDTO,
  GetBookingDetailsForVendorStrategyResponseDTO,
  GetBookingDetailsRequestDTO,
} from '../../dtos/booking_dto'

export interface IGetBookingDetailsFactory {
  getStrategy(
    payload: GetBookingDetailsRequestDTO
  ): Promise<
    | GetBookingDetailsForVendorStrategyResponseDTO
    | GetBookingDetailsForCustomerStrategyResponseDTO
  >
}
