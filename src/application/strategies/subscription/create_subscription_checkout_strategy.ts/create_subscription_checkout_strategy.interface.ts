import {
  CreateSubscriptionCheckoutDTO,
  CreateSubscriptionCheckoutStrategyDTO,
} from '../../../dtos/subscription_dto'

export interface ICreateSubscriptionCheckoutStrategy {
  execute(
    input: CreateSubscriptionCheckoutDTO,
  ): Promise<CreateSubscriptionCheckoutStrategyDTO>
}
