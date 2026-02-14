import { inject, injectable } from 'tsyringe'
import Stripe from 'stripe'

import { generateUniqueId } from '../../../../shared/utils/unique_uuid.helper'
import { IUserSubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface'
import { ISubscriptionPlanRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/subscription_plan.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../../shared/constants'
import { ISubscriptionCheckoutCompletedUseCase } from '../../../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_checkout_completed_usecase.interface'
import { ICreateNotificationUseCase } from '../../../../domain/useCaseInterfaces/notification/create_notification_usecase_interface'

@injectable()
export class SubscriptionCheckoutCompletedUseCase implements ISubscriptionCheckoutCompletedUseCase {
  constructor(
    @inject('IUserSubscriptionRepository')
    private readonly userSubscriptionRepository: IUserSubscriptionRepository,

    @inject('ISubscriptionPlanRepository')
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,

    @inject('ICreateNotificationUseCase')
    private readonly createNotificationUseCase: ICreateNotificationUseCase,
  ) {}

  async execute(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.metadata?.userId
    const planId = session.metadata?.planId
    const userRole = session.metadata?.role as 'vendor' | 'customer'

    if (!userId || !planId || !userRole) {
      throw new CustomError(
        'Invalid subscription metadata',
        HTTP_STATUS.BAD_REQUEST,
      )
    }

    if (!session.subscription) {
      throw new CustomError(
        'Stripe subscription missing in session',
        HTTP_STATUS.BAD_REQUEST,
      )
    }

    // Idempotency
    const existing = await this.userSubscriptionRepository.findOne({
      stripeCheckoutSessionId: session.id,
    })
    if (existing) return

    const plan = await this.subscriptionPlanRepository.findOne({ planId })
    if (!plan || !plan.isActive) {
      throw new CustomError(
        'Subscription plan not found or inactive',
        HTTP_STATUS.NOT_FOUND,
      )
    }
    await this.userSubscriptionRepository.save({
      subscriptionId: generateUniqueId(),
      userId,
      userRole,
      subscriptionPlanId: plan.planId,

      stripeCheckoutSessionId: session.id,
      stripeSubscriptionId: session.subscription as string,

      status: 'pending',
      autoRenew: true,
      paymentProvider: 'stripe',
      paymentStatus: 'initiated',
    })

    await this.createNotificationUseCase.execute({
      recipientId: userId,
      recipientRole: userRole,
      type: 'SUBSCRIPTION',
      title: 'Subscription Started',
      message: `Your ${plan.name} subscription has been initiated successfully.`,
    })

    await this.userSubscriptionRepository.save({
      subscriptionId: generateUniqueId(),
      userId,
      userRole,
      subscriptionPlanId: plan.planId,

      stripeCheckoutSessionId: session.id,
      stripeSubscriptionId: session.subscription as string,

      status: 'pending',
      autoRenew: true,
      paymentProvider: 'stripe',
      paymentStatus: 'initiated',
    })
  }
}
