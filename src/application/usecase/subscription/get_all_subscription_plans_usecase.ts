import { injectable, inject } from 'tsyringe'
import { IGetAllSubscriptionPlansUseCase } from '../../../domain/useCaseInterfaces/subscription/get_all_subscription_plans_usecase.interface'
import {
  GetAllSubscriptionPlansRequestDTO,
  GetAllSubscriptionPlansResponseDTO,
} from '../../dtos/subscription_dto'
import { ISubscriptionPlanRepository } from '../../../domain/repositoryInterfaces/feature/subscription/subscription_plan.interface'
import { GetAllSubscriptionPlansResponseMapper } from '../../mappers/subscription/get_all_subscription_plan_mapper'

@injectable()
export class GetAllSubscriptionPlansUseCase implements IGetAllSubscriptionPlansUseCase {
  constructor(
    @inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}
  async execute(
    input: GetAllSubscriptionPlansRequestDTO,
  ): Promise<GetAllSubscriptionPlansResponseDTO> {
    const response = await this._subscriptionPlanRepository.findAllDocuments(
      input.page,
      input.limit,
      input.search ?? '',
    )
    return GetAllSubscriptionPlansResponseMapper.toDTO(response)
  }
}
