import {
  RequestCreateBookingHoldDTO,
  ResponseCreateBookingHoldDTO,
} from '../../../application/dtos/booking_hold_dto'

export interface ICreateBookingHoldUseCase {
  execute(
    validatedDTO: RequestCreateBookingHoldDTO,
    customerId: string
  ): Promise<ResponseCreateBookingHoldDTO>
}
