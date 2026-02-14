import {
  GetBookingRequestDTO,
  GetBookingResponseDTO,
} from '../../dtos/booking_dto'

export interface IGetBookingsFactory {
  getStrategy(dto: GetBookingRequestDTO): Promise<GetBookingResponseDTO>
}
