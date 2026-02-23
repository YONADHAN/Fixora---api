import { CancelBookingRequestDTO } from '../../../dtos/booking_dto'

export interface ICustomerCancelBookingStrategyInterface {
  execute(payload: CancelBookingRequestDTO): Promise<void>
}
