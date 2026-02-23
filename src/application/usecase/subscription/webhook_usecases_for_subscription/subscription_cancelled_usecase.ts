import { inject, injectable } from 'tsyringe'
import Stripe from 'stripe'

import { ISubscriptionCancelledUseCase } from '../../../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_cancelled_usecase.interface'
import { IUserSubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface'

@injectable()
export class SubscriptionCancelledUseCase implements ISubscriptionCancelledUseCase {
  constructor(
    @inject('IUserSubscriptionRepository')
    private readonly userSubscriptionRepository: IUserSubscriptionRepository,
  ) { }

  async execute(subscription: Stripe.Subscription): Promise<void> {
    const stripeSubscriptionId = subscription.id

    const userSubscription = await this.userSubscriptionRepository.findOne({
      paymentProvider: 'stripe',
      paymentId: stripeSubscriptionId,
    })

    if (!userSubscription) {
      return
    }

    const endDate =
      typeof subscription.ended_at === 'number'
        ? new Date(subscription.ended_at * 1000)
        : new Date()

    await this.userSubscriptionRepository.update(
      { subscriptionId: userSubscription.subscriptionId },
      {
        status: 'cancelled',
        endDate,
        autoRenew: false,
        paymentStatus: 'failed',
      },
    )
  }
}
