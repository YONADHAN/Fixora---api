import { IBookingEntity } from '../../models/booking_entity'
import { GetBookingByPaymentIdResponseDTO } from '../../../application/dtos/booking_dto'

export interface IGetBookingByPaymentIdUseCase {
    execute(paymentId: string): Promise<GetBookingByPaymentIdResponseDTO | null>
}
