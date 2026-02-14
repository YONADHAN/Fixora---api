import { inject, injectable } from 'tsyringe'
import { IUpdateSubscriptionPlanUseCase } from '../../../domain/useCaseInterfaces/subscription/update_subscription_plan_usecase.interface'
import {
  UpdateSubscriptionPlanDTO,
  UpdateSubscriptionPlanResponseDTO,
} from '../../dtos/subscription_dto'
import Stripe from 'stripe'
import { ISubscriptionPlanRepository } from '../../../domain/repositoryInterfaces/feature/subscription/subscription_plan.interface'
import { config } from '../../../shared/config'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import { UpdateSubscriptionPlanResponseMapper } from '../../mappers/subscription/update_subscription_plan_mapper'
import { ISubscriptionPlanEntity } from '../../../domain/models/subscription_plan_entity'

@injectable()
export class UpdateSubscriptionPlanUseCase implements IUpdateSubscriptionPlanUseCase {
  private stripe: Stripe

  constructor(
    @inject('ISubscriptionPlanRepository')
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {
    this.stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY)
  }

  async execute(
    input: UpdateSubscriptionPlanDTO,
  ): Promise<UpdateSubscriptionPlanResponseDTO> {
    const { planId, price, currency, ...rest } = input

    const existingPlan = await this.subscriptionPlanRepository.findOne({
      planId,
    })

    if (!existingPlan) {
      throw new CustomError(
        ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    const updatePayload: Partial<ISubscriptionPlanEntity> = { ...rest }
    if (Object.keys(updatePayload).length === 0) {
      return UpdateSubscriptionPlanResponseMapper.toDTO(existingPlan)
    }

    // Price change is handled here, this is the only stripe implementation needed on the update side
    if (price !== undefined && price !== existingPlan.price) {
      if (price <= 0) {
        throw new CustomError(
          ERROR_MESSAGES.SUBSCRIPTION_PRICE_IS_NOT_NEGATIVE,
          HTTP_STATUS.BAD_REQUEST,
        )
      }

      const stripePrice = await this.stripe.prices.create({
        product: existingPlan.stripeProductId,
        unit_amount: price * 100,
        currency: (currency ?? existingPlan.currency).toLowerCase(),
        recurring: {
          interval: existingPlan.durationInDays === 30 ? 'month' : 'year',
        },
      })

      updatePayload.price = price
      updatePayload.currency = currency ?? existingPlan.currency
      updatePayload.stripePriceId = stripePrice.id
    }

    const updatedPlan = await this.subscriptionPlanRepository.update(
      { planId },
      updatePayload,
    )

    if (!updatedPlan) {
      throw new CustomError(
        ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    return UpdateSubscriptionPlanResponseMapper.toDTO(updatedPlan)
  }
}
