import Stripe from 'stripe'

export interface IStripePaymentFailedUseCase {
  execute(paymentIntent: Stripe.PaymentIntent): Promise<void>
}
