import {
  GetBookingRequestDTO,
  GetBookingResponseDTO,
} from '../../../dtos/booking_dto'

export interface IGetBookingForCustomerStrategyInterface {
  strategy(dto: GetBookingRequestDTO): Promise<GetBookingResponseDTO>
}
