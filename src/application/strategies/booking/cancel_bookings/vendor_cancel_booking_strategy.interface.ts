import { CancelBookingRequestDTO } from '../../../dtos/booking_dto'

export interface IVendorCancelBookingStrategyInterface {
  execute(payload: CancelBookingRequestDTO): Promise<void>
}
