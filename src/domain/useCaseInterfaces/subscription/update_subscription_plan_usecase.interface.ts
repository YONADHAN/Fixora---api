import {
  UpdateSubscriptionPlanDTO,
  UpdateSubscriptionPlanResponseDTO,
} from '../../../application/dtos/subscription_dto'

export interface IUpdateSubscriptionPlanUseCase {
  execute(
    input: UpdateSubscriptionPlanDTO,
  ): Promise<UpdateSubscriptionPlanResponseDTO>
}
