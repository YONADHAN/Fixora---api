import { CheckSubscriptionForAllowUsingBenefitRequestDTO, CheckSubscriptionForAllowUsingBenefitResponseDTO } from "../../../application/dtos/subscription_dto";

export interface ICheckSubscriptionForAllowUsingBenefitUseCase {
    execute(input:CheckSubscriptionForAllowUsingBenefitRequestDTO): Promise<CheckSubscriptionForAllowUsingBenefitResponseDTO>
}