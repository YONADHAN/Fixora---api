import { TRole } from "../../../shared/constants";
import { ICheckSubscriptionForAllowUsingBenefitStrategy } from "../../strategies/subscription/check_subscription_for_allow_using_benefit_strategy.ts/check_subscription_for_allow_using_benefit_strategy.interface";

export interface ICheckSubscriptionForAllowUsingBenefitFactory {
    execute(role:TRole): ICheckSubscriptionForAllowUsingBenefitStrategy
}