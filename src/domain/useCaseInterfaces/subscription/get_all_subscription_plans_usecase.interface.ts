import {
  GetAllSubscriptionPlansRequestDTO,
  GetAllSubscriptionPlansResponseDTO,
} from '../../../application/dtos/subscription_dto'

export interface IGetAllSubscriptionPlansUseCase {
  execute(
    input: GetAllSubscriptionPlansRequestDTO,
  ): Promise<GetAllSubscriptionPlansResponseDTO>
}
