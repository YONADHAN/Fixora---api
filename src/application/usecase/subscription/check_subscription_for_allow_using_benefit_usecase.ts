import {injectable, inject} from 'tsyringe';

import { CheckSubscriptionForAllowUsingBenefitRequestDTO, CheckSubscriptionForAllowUsingBenefitResponseDTO } from '../../dtos/subscription_dto';
import { ICheckSubscriptionForAllowUsingBenefitUseCase } from '../../../domain/useCaseInterfaces/subscription/check_subscription_for_allow_using_benefit_usecase.interface';
import { ICheckSubscriptionForAllowUsingBenefitFactory } from '../../factories/subscription/check_subscription_for_allow_using_benefit_factory.interface';
import { TRole } from '../../../shared/constants';

@injectable()
export class CheckSubscriptionForAllowUsingBenefitUseCase implements ICheckSubscriptionForAllowUsingBenefitUseCase {
    constructor(
       


        @inject('ICheckSubscriptionForAllowUsingBenefitFactory')
        private readonly _checkSubscriptionForAllowUsingBenefitFactory: ICheckSubscriptionForAllowUsingBenefitFactory,
    ){}

    async execute(input:CheckSubscriptionForAllowUsingBenefitRequestDTO): Promise<CheckSubscriptionForAllowUsingBenefitResponseDTO>{
        const strategy = this._checkSubscriptionForAllowUsingBenefitFactory.execute(input.role as TRole)
        return strategy.execute({role:input.role, userId:input.userId,benefit:input.benefit});
    }
}