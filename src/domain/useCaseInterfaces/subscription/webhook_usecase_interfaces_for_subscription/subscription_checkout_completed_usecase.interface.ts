import Stripe from 'stripe'

export interface ISubscriptionCheckoutCompletedUseCase {
    execute(session: Stripe.Checkout.Session): Promise<void>
}
