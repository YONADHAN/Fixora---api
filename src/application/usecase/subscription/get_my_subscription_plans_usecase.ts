import { inject, injectable } from 'tsyringe';

import { IUserSubscriptionRepository } from '../../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface';
import { CustomError } from '../../../domain/utils/custom.error';
import { HTTP_STATUS } from '../../../shared/constants';
import { GetMySubscriptionRequestDTO, GetMySubscriptionResponseDTO } from '../../dtos/subscription_dto';
import { GetMySubscriptionPlansResponseMapper } from '../../mappers/subscription/get_my_subscription_plan_mapper';
import { IGetMySubscriptionPlansUseCase } from '../../../domain/useCaseInterfaces/subscription/get_my_subscription_plans_usecase.interface';
@injectable()
export class GetMySubscriptionPlansUsecase implements IGetMySubscriptionPlansUseCase {
    constructor(

        @inject('IUserSubscriptionRepository')
        private readonly _userSubscriptionPlanRepo: IUserSubscriptionRepository,

    ) {

    }

    async execute(
        input: GetMySubscriptionRequestDTO
    ): Promise<GetMySubscriptionResponseDTO> {

        const subscriptions =
            await this._userSubscriptionPlanRepo.getMySubscriptionPlans(input.userId)

        if (!subscriptions || subscriptions.length === 0) {
            throw new CustomError(
                'Subscription plans not found',
                HTTP_STATUS.NOT_FOUND
            )
        }

        return GetMySubscriptionPlansResponseMapper.toDTO(subscriptions)
    }
}
