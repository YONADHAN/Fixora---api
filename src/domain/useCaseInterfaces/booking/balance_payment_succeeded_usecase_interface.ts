import Stripe from 'stripe'

export interface IBalancePaymentSucceededUseCase {
    execute(paymentIntent: Stripe.PaymentIntent): Promise<void>
}
