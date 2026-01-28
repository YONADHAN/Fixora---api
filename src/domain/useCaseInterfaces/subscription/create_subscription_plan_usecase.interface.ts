import {
  CreateSubscriptionPlanDTO,
  CreateSubscriptionPlanResponseDTO,
} from '../../../application/dtos/subscription_dto'

export interface ICreateSubscriptionPlanUseCase {
  execute(
    input: CreateSubscriptionPlanDTO,
  ): Promise<CreateSubscriptionPlanResponseDTO>
}
