import { inject, injectable } from 'tsyringe'
import {
    ERROR_MESSAGES,
    HTTP_STATUS,
    ROLES,
    TRole,
} from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { ICustomerAnalyticsFactory } from './ICustomerAnalyticsFactory'
import { ICustomerAnalyticsStrategy } from '../../strategies/dashboard/customer/ICustomerAnalyticsStrategy'
import { CustomerAnalyticsStrategyForAdmin } from '../../strategies/dashboard/customer/CustomerAnalyticsStrategyForAdmin'
import { CustomerAnalyticsStrategyForVendor } from '../../strategies/dashboard/customer/CustomerAnalyticsStrategyForVendor'

@injectable()
export class CustomerAnalyticsFactory implements ICustomerAnalyticsFactory {
    constructor(
        @inject('CustomerAnalyticsStrategyForAdmin')
        private readonly _customerStrategyForAdmin: CustomerAnalyticsStrategyForAdmin,
        @inject('CustomerAnalyticsStrategyForVendor')
        private readonly _customerStrategyForVendor: CustomerAnalyticsStrategyForVendor,
    ) { }

    getStrategy(role: TRole): ICustomerAnalyticsStrategy {
        switch (role) {
            case ROLES.ADMIN:
                return this._customerStrategyForAdmin

            case ROLES.VENDOR:
                return this._customerStrategyForVendor

            default:
                throw new CustomError(
                    ERROR_MESSAGES.INVALID_ROLE,
                    HTTP_STATUS.BAD_REQUEST,
                )
        }
    }
}
