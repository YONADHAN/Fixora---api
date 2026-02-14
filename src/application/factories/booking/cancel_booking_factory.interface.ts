import { CancelBookingRequestDTO } from '../../dtos/booking_dto'

export interface ICancelBookingFactory {
  getStrategy(payload: CancelBookingRequestDTO): Promise<void>
}
