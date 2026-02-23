import { SubscriptionPlanAIDTO } from '../../../../application/dtos/ai_dto'

export interface IAISubscriptionRepository {
  execute(): Promise<SubscriptionPlanAIDTO[]>
}
