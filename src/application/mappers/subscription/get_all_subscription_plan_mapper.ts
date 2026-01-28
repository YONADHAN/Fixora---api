import { ISubscriptionPlanEntity } from '../../../domain/models/subscription_plan_entity'
import { GetAllSubscriptionPlansResponseDTO } from '../../dtos/subscription_dto'

export class GetAllSubscriptionPlansResponseMapper {
  static toDTO(input: {
    data: ISubscriptionPlanEntity[]
    currentPage: number
    totalPages: number
  }): GetAllSubscriptionPlansResponseDTO {
    const filteredData = input.data?.map((subPlan) => ({
      planId: subPlan.planId,
      name: subPlan.name,
      description: subPlan.description,
      price: subPlan.price,
      currency: subPlan.currency,
      durationInDays: subPlan.durationInDays,
      features: {
        maxServices: subPlan.features?.maxServices,
        videoCallAccess: subPlan.features?.videoCallAccess,
        aiChatbotAccess: subPlan.features?.aiChatbotAccess,
      },
      benefits: subPlan.benefits,
      isActive: subPlan.isActive,
      createdByAdminId: subPlan.createdByAdminId,
      createdAt: subPlan.createdAt,
      updatedAt: subPlan.updatedAt,
    }))

    return {
      data: filteredData,
      currentPage: input.currentPage,
      totalPages: input.totalPages,
    }
  }
}
