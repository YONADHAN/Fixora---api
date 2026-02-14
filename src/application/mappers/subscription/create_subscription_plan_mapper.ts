import { ISubscriptionPlanEntity } from '../../../domain/models/subscription_plan_entity'
import { CreateSubscriptionPlanResponseDTO } from '../../dtos/subscription_dto'

export class CreateSubscriptionPlanResponseMapper {
  static toDTO(
    response: ISubscriptionPlanEntity,
  ): CreateSubscriptionPlanResponseDTO {
    return {
      planId: response.planId,
      name: response.name,
      description: response.description,
      price: response.price,
      currency: response.currency,
      durationInDays: response.durationInDays,
      features: response.features,
      benefits: response.benefits,
      isActive: response.isActive,
      createdByAdminId: response.createdByAdminId,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    }
  }
}
