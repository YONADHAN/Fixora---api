import { inject, injectable } from 'tsyringe'
import Stripe from 'stripe'
import { IUserSubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface'
import { HTTP_STATUS } from '../../../../shared/constants'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ISubscriptionInvoicePaidUseCase } from '../../../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_invoice_paid_usecase.interface'

type StripeInvoiceWithSubscription = Stripe.Invoice & {
  subscription: string | Stripe.Subscription | null
}
@injectable()
export class SubscriptionInvoicePaidUseCase implements ISubscriptionInvoicePaidUseCase {
  constructor(
    @inject('IUserSubscriptionRepository')
    private readonly userSubscriptionRepository: IUserSubscriptionRepository,
  ) {}

  async execute(invoice: Stripe.Invoice): Promise<void> {
    const invoiceWithSubscription = invoice as StripeInvoiceWithSubscription
    const stripeSubscriptionId = invoiceWithSubscription.subscription as string
    if (!stripeSubscriptionId) return

    const userSubscription = await this.userSubscriptionRepository.findOne({
      stripeSubscriptionId,
    })

    if (!userSubscription) return

    const lineItem = invoice.lines.data[0]
    if (!lineItem?.period?.start || !lineItem?.period?.end) {
      throw new CustomError(
        'Invalid invoice period data',
        HTTP_STATUS.BAD_REQUEST,
      )
    }

    const startDate = new Date(lineItem.period.start * 1000)
    const endDate = new Date(lineItem.period.end * 1000)

    await this.userSubscriptionRepository.update(
      { subscriptionId: userSubscription.subscriptionId },
      {
        startDate,
        endDate,
        status: 'active',
        paymentStatus: 'success',
      },
    )
  }
}
