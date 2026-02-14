import {
  GetBookingDetailsForCustomerStrategyResponseDTO,
  GetBookingDetailsForVendorStrategyResponseDTO,
  GetBookingDetailsRequestDTO,
} from '../../../application/dtos/booking_dto'

export interface IGetBookingDetailsUseCase {
  execute(
    payload: GetBookingDetailsRequestDTO
  ): Promise<
    | GetBookingDetailsForVendorStrategyResponseDTO
    | GetBookingDetailsForCustomerStrategyResponseDTO
  >
}
