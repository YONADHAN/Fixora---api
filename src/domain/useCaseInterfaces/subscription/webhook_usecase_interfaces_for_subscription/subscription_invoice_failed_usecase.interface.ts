import Stripe from 'stripe'

export interface ISubscriptionInvoiceFailedUseCase {
    execute(invoice: Stripe.Invoice): Promise<void>
}
