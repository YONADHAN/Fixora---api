import { inject, injectable } from 'tsyringe'
import {
  CreateSubscriptionCheckoutDTO,
  CreateSubscriptionCheckoutStrategyDTO,
} from '../../dtos/subscription_dto'
import { ICreateSubscriptionCheckoutFactory } from '../../factories/subscription/create_subscription_checkout_factory.interface'
import { ICreateSubscriptionCheckoutUseCase } from '../../../domain/useCaseInterfaces/subscription/create_subscription_checkout_usecase.interface'

@injectable()
export class CreateSubscriptionCheckoutUseCase implements ICreateSubscriptionCheckoutUseCase {
  constructor(
    @inject('ICreateSubscriptionCheckoutFactory')
    private readonly _checkoutFactory: ICreateSubscriptionCheckoutFactory,
  ) {}

  async execute(
    input: CreateSubscriptionCheckoutDTO,
  ): Promise<CreateSubscriptionCheckoutStrategyDTO> {
    const strategy = this._checkoutFactory.getStrategy(input.role)

    const response = await strategy.execute(input)

    return { url: response.url }
  }
}
