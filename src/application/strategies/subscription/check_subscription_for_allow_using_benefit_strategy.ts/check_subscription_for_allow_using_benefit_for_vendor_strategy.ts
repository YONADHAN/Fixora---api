import { inject, injectable } from 'tsyringe'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface';
import { IUserSubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface';
import { ISubscriptionPlanRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/subscription_plan.interface';
import { CustomError } from '../../../../domain/utils/custom.error';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants';
import { ICheckSubscriptionForAllowUsingBenefitForVendorStrategy } from './check_subsciption_for_allow_using_benefit_for_vendor_strategy.interface';
import { CheckSubscriptionForAllowUsingBenefitRequestDTO, CheckSubscriptionForAllowUsingBenefitResponseDTO } from '../../../dtos/subscription_dto';
type BenefitKey = 'videoCallAccess' | 'aiChatbotAccess'
const allowedBenefits: BenefitKey[] = ['videoCallAccess','aiChatbotAccess']
@injectable()
export class CheckSubscriptionForAllowUsingBenefitForVendor implements ICheckSubscriptionForAllowUsingBenefitForVendorStrategy {
    constructor(
        @inject('IVendorRepository')
        private readonly _vendorRepository: IVendorRepository,

        @inject('IUserSubscriptionRepository')
        private readonly _userSubscriptionRepository: IUserSubscriptionRepository,

        @inject('ISubscriptionPlanRepository')
        private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    ) { }
    async execute(input: CheckSubscriptionForAllowUsingBenefitRequestDTO): Promise<CheckSubscriptionForAllowUsingBenefitResponseDTO> {
        const vendor = await this._vendorRepository.findOne({ userId: input.userId })
        if (!vendor) {
            throw new CustomError(ERROR_MESSAGES.USERS_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        }

        const userSubscription = await this._userSubscriptionRepository.findOne({ userId: vendor.userId })

        if (!userSubscription) {
            throw new CustomError(ERROR_MESSAGES.USER_SUBSCRIPTION_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        }

        const subscriptionPlanId = userSubscription.subscriptionPlanId

        const subscription = await this._subscriptionPlanRepository.findOne({ subscriptionPlanId: subscriptionPlanId })

        if (!subscription) {
            throw new CustomError(ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        }
       if(!allowedBenefits.includes(input.benefit as BenefitKey)) {
        throw new CustomError("Benefit not found", HTTP_STATUS.METHOD_NOT_ALLOWED)
       }
        if (!subscription.isActive) {
            throw new CustomError(ERROR_MESSAGES.SUBSCRIPTION_IS_NOT_ACTIVE_NOW, HTTP_STATUS.NOT_FOUND)
        }
        // subscription.status === ACTIVE
        // subscription.expiryDate > now
        // usageLimit not exceeded
        const hasAccess = subscription.features?.[input.benefit as BenefitKey]

        if (!hasAccess) {
            throw new CustomError(
                ERROR_MESSAGES.UNAUTHORIZED,
                HTTP_STATUS.METHOD_NOT_ALLOWED
            )
        }

        return { data: true };
    }
}