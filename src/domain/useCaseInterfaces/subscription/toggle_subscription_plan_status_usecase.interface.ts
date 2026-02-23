import {
  ToggleSubscriptionPlanStatusDTO,
  ToggleSubscriptionPlanStatusResponseDTO,
} from '../../../application/dtos/subscription_dto'

export interface IToggleSubscriptionPlanStatusUseCase {
  execute(
    input: ToggleSubscriptionPlanStatusDTO,
  ): Promise<ToggleSubscriptionPlanStatusResponseDTO>
}
