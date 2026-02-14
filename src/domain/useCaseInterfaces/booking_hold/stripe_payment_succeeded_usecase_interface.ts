import Stripe from 'stripe'

export interface IStripePaymentSucceedUseCase {
  execute(paymentIntent: Stripe.PaymentIntent): Promise<void>
}
