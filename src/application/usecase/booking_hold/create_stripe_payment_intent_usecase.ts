import { inject, injectable } from 'tsyringe'
import { IBookingHoldRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_hold_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import Stripe from 'stripe'
import { config } from '../../../shared/config'
import { CreatePaymentIntentResponseDTO } from '../../dtos/booking_hold_dto'
import { ICreateStripePaymentIntentUseCase } from '../../../domain/useCaseInterfaces/booking_hold/create_stripe_payment_intent_usecase_interface'

export const stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY)

@injectable()
export class CreateStripePaymentIntentUseCase
  implements ICreateStripePaymentIntentUseCase
{
  constructor(
    @inject('IBookingHoldRepository')
    private bookingHoldRepository: IBookingHoldRepository
  ) {}

  async execute(validatedDTO: string): Promise<CreatePaymentIntentResponseDTO> {
    const holdId = validatedDTO
    const hold = await this.bookingHoldRepository.findActiveHoldById(holdId)
    if (!hold) {
      throw new CustomError('Booking hold not found or expired', 404)
    }
    if (hold.expiresAt < new Date()) {
      throw new CustomError('Booking hold expired', 410)
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: hold.pricing.advanceAmount * 100,
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
      metadata: {
        holdId: hold.holdId,
        serviceRef: hold.serviceRef,
        customerRef: hold.customerRef,
      },
    })

    console.log('current payment internt id for holding', paymentIntent.id)

    await this.bookingHoldRepository.update(
      { holdId },
      { stripePaymentIntentId: paymentIntent.id }
    )
    return {
      clientSecret: paymentIntent.client_secret!,
    }
  }
}
