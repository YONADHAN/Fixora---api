import { inject, injectable } from 'tsyringe'
import { ISubscriptionPlanRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/subscription_plan.interface'
import { SubscriptionPlanAIDTO } from '../../../../application/dtos/ai_dto'
import { IAISubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_subscription_plan_repository.interface'

@injectable()
export class AISubscriptionRepository implements IAISubscriptionRepository {
  constructor(
    @inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(): Promise<SubscriptionPlanAIDTO[]> {
    const plans =
      await this._subscriptionPlanRepository.findAllDocsWithoutPagination({
        isActive: true,
      })

    return plans.map((plan) => ({
      planId: plan.planId,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      durationInDays: plan.durationInDays,
      features: plan.features,
      benefits: plan.benefits,
    }))
  }
}
