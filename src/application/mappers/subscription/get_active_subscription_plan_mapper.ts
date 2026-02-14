import { ISubscriptionPlanEntity } from '../../../domain/models/subscription_plan_entity'
import { GetActiveSubscriptionPlansResponseDTO } from '../../dtos/subscription_dto'

export class GetActiveSubscriptionPlansResponseMapper {
  private static resolveInterval(days: number): 'month' | 'year' {
    return days >= 365 ? 'year' : 'month'
  }

  static toDTO(response: {
    data: ISubscriptionPlanEntity[]
    currentPage: number
    totalPages: number
  }): GetActiveSubscriptionPlansResponseDTO {
    const filteredData = response.data?.map((plan) => ({
      planId: plan.planId,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      interval: this.resolveInterval(plan.durationInDays),
      benefits: plan.benefits,
    }))
    return {
      data: filteredData,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
    }
  }
}
