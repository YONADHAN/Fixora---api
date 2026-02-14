import {
  GetActiveSubscriptionPlansRequestDTO,
  GetActiveSubscriptionPlansResponseDTO,
} from '../../../application/dtos/subscription_dto'

export interface IGetActiveSubscriptionPlansUseCase {
  execute(
    input: GetActiveSubscriptionPlansRequestDTO,
  ): Promise<GetActiveSubscriptionPlansResponseDTO>
}
