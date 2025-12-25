import {
  GetBookingRequestDTO,
  GetBookingResponseDTO,
} from '../../../application/dtos/booking_dto'

export interface IGetBookingsUseCase {
  execute(dto: GetBookingRequestDTO): Promise<GetBookingResponseDTO>
}
