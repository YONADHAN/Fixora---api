import { ISubscriptionPlanEntity } from '../../../domain/models/subscription_plan_entity'
import { UpdateSubscriptionPlanResponseDTO } from '../../dtos/subscription_dto'

export class UpdateSubscriptionPlanResponseMapper {
  static toDTO(
    input: ISubscriptionPlanEntity,
  ): UpdateSubscriptionPlanResponseDTO {
    return {
      planId: input.planId,
      name: input.name,
      description: input.description,
      price: input.price,
      currency: input.currency,
      durationInDays: input.durationInDays,
      features: {
        maxServices: input.features?.maxServices,
        videoCallAccess: input.features?.videoCallAccess,
        aiChatbotAccess: input.features?.aiChatbotAccess,
      },
      benefits: input.benefits,
      isActive: input.isActive,
      createdByAdminId: input.createdByAdminId,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    }
  }
}
