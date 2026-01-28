import { injectable, inject } from 'tsyringe'
import { IToggleSubscriptionPlanStatusUseCase } from '../../../domain/useCaseInterfaces/subscription/toggle_subscription_plan_status_usecase.interface'
import {
  ToggleSubscriptionPlanStatusDTO,
  ToggleSubscriptionPlanStatusResponseDTO,
} from '../../dtos/subscription_dto'
import { ISubscriptionPlanRepository } from '../../../domain/repositoryInterfaces/feature/subscription/subscription_plan.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import { ToggleSubscriptionPlanResponseMapper } from '../../mappers/subscription/toggle_subscription_plan_status_mapper'

@injectable()
export class ToggleSubscriptionPlanStatusUseCase implements IToggleSubscriptionPlanStatusUseCase {
  constructor(
    @inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}
  async execute(
    input: ToggleSubscriptionPlanStatusDTO,
  ): Promise<ToggleSubscriptionPlanStatusResponseDTO> {
    const planId = input.planId
    const subscriptionPlan = await this._subscriptionPlanRepository.findOne({
      planId,
    })
    if (!subscriptionPlan) {
      throw new CustomError(
        ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    const response = await this._subscriptionPlanRepository.update(
      { planId },
      { isActive: !subscriptionPlan.isActive },
    )

    if (!response) {
      throw new CustomError(
        ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }
    return ToggleSubscriptionPlanResponseMapper.toDTO(response)
  }
}
