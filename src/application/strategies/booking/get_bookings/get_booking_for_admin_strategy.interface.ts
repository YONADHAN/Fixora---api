import {
  GetBookingRequestDTO,
  GetBookingResponseDTO,
} from '../../../dtos/booking_dto'

export interface IGetBookingForAdminStrategyInterface {
  strategy(dto: GetBookingRequestDTO): Promise<GetBookingResponseDTO>
}
