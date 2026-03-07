

import { injectable, inject } from "tsyringe";
import { ERROR_MESSAGES, HTTP_STATUS, ROLES, TRole } from "../../../shared/constants";
import { CustomError } from "../../../domain/utils/custom.error";
import { ICheckSubscriptionForAllowUsingBenefitFactory } from "./check_subscription_for_allow_using_benefit_factory.interface";
import { ICheckSubscriptionForAllowUsingBenefitForVendorStrategy } from "../../strategies/subscription/check_subscription_for_allow_using_benefit_strategy.ts/check_subsciption_for_allow_using_benefit_for_vendor_strategy.interface";

@injectable()
export class CheckSubscriptionForAllowUsingBenefitFactory implements ICheckSubscriptionForAllowUsingBenefitFactory {

    constructor(
        @inject('ICheckSubscriptionForAllowUsingBenefitForVendorStrategy')
        private readonly _vendorStrategy: ICheckSubscriptionForAllowUsingBenefitForVendorStrategy,
    ){}

    execute(role:TRole){
        switch(role){
            case ROLES.VENDOR:
                return this._vendorStrategy
            default:
                throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.BAD_REQUEST)
        }
    }
}