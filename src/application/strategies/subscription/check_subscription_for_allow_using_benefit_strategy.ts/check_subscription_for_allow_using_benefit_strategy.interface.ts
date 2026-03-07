import { CheckSubscriptionForAllowUsingBenefitRequestDTO, CheckSubscriptionForAllowUsingBenefitResponseDTO } from "../../../dtos/subscription_dto";

export interface ICheckSubscriptionForAllowUsingBenefitStrategy{
     execute(input:CheckSubscriptionForAllowUsingBenefitRequestDTO): Promise<CheckSubscriptionForAllowUsingBenefitResponseDTO>
}