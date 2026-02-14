import {
  CreateSubscriptionCheckoutDTO,
  CreateSubscriptionCheckoutStrategyDTO,
} from '../../../application/dtos/subscription_dto'

export interface ICreateSubscriptionCheckoutUseCase {
  execute(
    input: CreateSubscriptionCheckoutDTO,
  ): Promise<CreateSubscriptionCheckoutStrategyDTO>
}
