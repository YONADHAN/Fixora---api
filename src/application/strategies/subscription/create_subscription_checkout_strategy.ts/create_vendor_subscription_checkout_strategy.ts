import { inject, injectable } from 'tsyringe'
import { stripe } from '../../../../interfaceAdapters/stripe/stripe.client'
import { CustomError } from '../../../../domain/utils/custom.error'
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  ROLES,
} from '../../../../shared/constants'
import { ISubscriptionPlanRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/subscription_plan.interface'
import { IUserSubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface'
import {
  CreateSubscriptionCheckoutDTO,
  CreateSubscriptionCheckoutStrategyDTO,
} from '../../../dtos/subscription_dto'
import { ICreateVendorSubscriptionCheckoutStrategy } from './create_vendor_subscription_checkout_strategy.interface'

@injectable()
export class CreateVendorSubscriptionCheckoutStrategy implements ICreateVendorSubscriptionCheckoutStrategy {
  constructor(
    @inject('ISubscriptionPlanRepository')
    private readonly subscriptionPlanRepo: ISubscriptionPlanRepository,

    @inject('IUserSubscriptionRepository')
    private readonly userSubscriptionRepo: IUserSubscriptionRepository,
  ) {}

  async execute(
    input: CreateSubscriptionCheckoutDTO,
  ): Promise<CreateSubscriptionCheckoutStrategyDTO> {
    const { userId, planId } = input

    const plan = await this.subscriptionPlanRepo.findOne({ planId })
    if (!plan || !plan.isActive) {
      throw new CustomError(
        ERROR_MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    if (!plan.stripePriceId) {
      throw new CustomError(
        ERROR_MESSAGES.STRIPE_PRICE_NOT_CONFIGURED,
        HTTP_STATUS.BAD_REQUEST,
      )
    }

    const existingSubscription = await this.userSubscriptionRepo.findOne({
      userId,
      status: { $in: ['pending', 'active'] },
    })

    if (existingSubscription) {
      throw new CustomError(
        ERROR_MESSAGES.SUBSCRIPTION_ALREADY_ACTIVE,
        HTTP_STATUS.CONFLICT,
      )
    }

    // for avoiding idempotency problem  or
    // to avoid multiple subscription checkouts due to multiple checkout key press
    // const idempotencyKey = `sub_checkout_${userId}_${plan.planId}`
    // Stripe checkout section creation
    const session = await stripe.checkout.sessions.create(
      {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_FRONTEND_URL}/vendor/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_FRONTEND_URL}/vendor/subscription/cancel`,
        metadata: {
          userId,
          role: ROLES.VENDOR,
          planId: plan.planId,
        },
      },
      //{ idempotencyKey },
    )

    if (!session.url) {
      throw new CustomError(
        ERROR_MESSAGES.STRIPE_CHECKOUT_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      )
    }

    return {
      url: session.url,
    }
  }
}
