import { CreatePaymentIntentResponseDTO } from '../../../application/dtos/booking_hold_dto'

export interface ICreateStripePaymentIntentUseCase {
  execute(validatedDTO: string): Promise<CreatePaymentIntentResponseDTO>
}
