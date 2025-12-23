import {
  GetBookingRequestDTO,
  GetBookingResponseDTO,
} from '../../../dtos/booking_dto'

export interface IGetBookingForVendorStrategyInterface {
  strategy(dto: GetBookingRequestDTO): Promise<GetBookingResponseDTO>
}
