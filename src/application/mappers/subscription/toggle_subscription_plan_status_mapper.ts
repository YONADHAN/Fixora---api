import { ISubscriptionPlanEntity } from '../../../domain/models/subscription_plan_entity'
import { ToggleSubscriptionPlanStatusResponseDTO } from '../../dtos/subscription_dto'

export class ToggleSubscriptionPlanResponseMapper {
  static toDTO(
    response: ISubscriptionPlanEntity,
  ): ToggleSubscriptionPlanStatusResponseDTO {
    return {
      planId: response.planId,
      isActive: response.isActive,
    }
  }
}
