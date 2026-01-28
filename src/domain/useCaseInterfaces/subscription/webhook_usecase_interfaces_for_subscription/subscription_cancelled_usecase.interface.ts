import Stripe from 'stripe'

export interface ISubscriptionCancelledUseCase {
    execute(subscription: Stripe.Subscription): Promise<void>
}
