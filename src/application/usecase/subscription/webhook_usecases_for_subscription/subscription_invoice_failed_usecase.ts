import { inject, injectable } from 'tsyringe'
import Stripe from 'stripe'

import { ISubscriptionInvoiceFailedUseCase } from '../../../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_invoice_failed_usecase.interface'
import { IUserSubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface'
type StripeInvoiceWithSubscription = Stripe.Invoice & {
  subscription: string | Stripe.Subscription | null
}

@injectable()
export class SubscriptionInvoiceFailedUseCase implements ISubscriptionInvoiceFailedUseCase {
  constructor(
    @inject('IUserSubscriptionRepository')
    private readonly userSubscriptionRepository: IUserSubscriptionRepository,
  ) { }

  async execute(invoice: Stripe.Invoice): Promise<void> {
    const invoiceWithSubscription = invoice as StripeInvoiceWithSubscription
    const stripeSubscriptionId =
      typeof invoiceWithSubscription.subscription === 'string'
        ? invoiceWithSubscription.subscription
        : null

    if (!stripeSubscriptionId) {
      return
    }

    const userSubscription = await this.userSubscriptionRepository.findOne({
      paymentProvider: 'stripe',
      paymentId: stripeSubscriptionId,
    })

    if (!userSubscription) {
      return
    }

    await this.userSubscriptionRepository.update(
      { subscriptionId: userSubscription.subscriptionId },
      {
        status: 'expired',
        paymentStatus: 'failed',
      },
    )
  }
}
