import { injectable, inject } from 'tsyringe'
import { ICreateSubscriptionPlanUseCase } from '../../../domain/useCaseInterfaces/subscription/create_subscription_plan_usecase.interface'
import {
  CreateSubscriptionPlanDTO,
  CreateSubscriptionPlanResponseDTO,
} from '../../dtos/subscription_dto'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'

import { ISubscriptionPlanRepository } from '../../../domain/repositoryInterfaces/feature/subscription/subscription_plan.interface'
import Stripe from 'stripe'
import { config } from '../../../shared/config'
import { generateUniqueId } from '../../../shared/utils/unique_uuid.helper'
import { ISubscriptionPlanEntity } from '../../../domain/models/subscription_plan_entity'
import { CreateSubscriptionPlanResponseMapper } from '../../mappers/subscription/create_subscription_plan_mapper'

@injectable()
export class CreateSubscriptionPlanUseCase implements ICreateSubscriptionPlanUseCase {
  private stripe: Stripe
  constructor(
    @inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {
    this.stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY)
  }
  async execute(
    input: CreateSubscriptionPlanDTO,
  ): Promise<CreateSubscriptionPlanResponseDTO> {
    const {
      name,
      description,
      price,
      currency,
      interval,
      features,
      benefits,
      createdByAdminId,
    } = input

    if (price <= 0) {
      throw new CustomError(
        ERROR_MESSAGES.SUBSCRIPTION_PRICE_IS_NOT_NEGATIVE,
        HTTP_STATUS.BAD_REQUEST,
      )
    }

    const existingPlan = await this._subscriptionPlanRepository.findOne({
      name,
    })

    if (existingPlan) {
      throw new CustomError(
        ERROR_MESSAGES.SUBSCRIPTION_PLAN_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT,
      )
    }

    //STRIPE METHODS begins here for subscription

    //create the stripe product (subscription plan) name
    const product = await this.stripe.products.create({
      name,
      description,
    })

    //add the subscription price using the product id (given by the stripe ) created now within the stripe
    const stripePrice = await this.stripe.prices.create({
      product: product.id,
      unit_amount: price * 100,
      currency: currency.toLowerCase(),
      recurring: {
        interval,
      },
    })

    const durationInDays = interval === 'month' ? 30 : 365

    //save the stripe price id and product id in the db for later
    const subscriptionPlanEntity: ISubscriptionPlanEntity = {
      planId: generateUniqueId(),
      name,
      description,
      price,
      currency,
      durationInDays,
      features,
      benefits,
      isActive: true,
      createdByAdminId,
      stripePriceId: stripePrice.id,
      stripeProductId: product.id,
    }

    const createdPlan = await this._subscriptionPlanRepository.create({
      ...subscriptionPlanEntity,
    })

    return CreateSubscriptionPlanResponseMapper.toDTO(createdPlan)
  }
}
