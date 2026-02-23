import { CancelBookingRequestDTO } from '../../../application/dtos/booking_dto'

export interface ICancelBookingUseCase {
  execute(payload: CancelBookingRequestDTO): Promise<void>
}
