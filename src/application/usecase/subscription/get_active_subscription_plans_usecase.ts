import { inject, injectable } from 'tsyringe'
import { ISubscriptionPlanRepository } from '../../../domain/repositoryInterfaces/feature/subscription/subscription_plan.interface'
import {
  GetActiveSubscriptionPlansRequestDTO,
  GetActiveSubscriptionPlansResponseDTO,
} from '../../dtos/subscription_dto'
import { IGetActiveSubscriptionPlansUseCase } from '../../../domain/useCaseInterfaces/subscription/get_active_subscription_plans_usecase.interface'
import { GetActiveSubscriptionPlansResponseMapper } from '../../mappers/subscription/get_active_subscription_plan_mapper'

@injectable()
export class GetActiveSubscriptionPlansUseCase implements IGetActiveSubscriptionPlansUseCase {
  constructor(
    @inject('ISubscriptionPlanRepository')
    private readonly repo: ISubscriptionPlanRepository,
  ) {}

  async execute(
    input: GetActiveSubscriptionPlansRequestDTO,
  ): Promise<GetActiveSubscriptionPlansResponseDTO> {
    const { page, limit, search } = input

    const response = await this.repo.findAllDocumentsWithFilteration(
      page,
      limit,
      search ?? '',
      { isActive: true },
    )

    return GetActiveSubscriptionPlansResponseMapper.toDTO(response)
  }
}
