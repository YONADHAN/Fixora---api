import Stripe from 'stripe'

export interface ISubscriptionInvoicePaidUseCase {
    execute(invoice: Stripe.Invoice): Promise<void>
}
