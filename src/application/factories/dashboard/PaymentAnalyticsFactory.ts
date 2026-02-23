import { inject, injectable } from 'tsyringe'
import {
    ERROR_MESSAGES,
    HTTP_STATUS,
    ROLES,
    TRole,
} from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { IPaymentAnalyticsFactory } from './IPaymentAnalyticsFactory'
import { IPaymentAnalyticsStrategy } from '../../strategies/dashboard/payment/IPaymentAnalyticsStrategy'
import { PaymentAnalyticsStrategyForAdmin } from '../../strategies/dashboard/payment/PaymentAnalyticsStrategyForAdmin'
import { PaymentAnalyticsStrategyForVendor } from '../../strategies/dashboard/payment/PaymentAnalyticsStrategyForVendor'

@injectable()
export class PaymentAnalyticsFactory implements IPaymentAnalyticsFactory {
    constructor(
        @inject('PaymentAnalyticsStrategyForAdmin')
        private readonly _paymentStrategyForAdmin: PaymentAnalyticsStrategyForAdmin,
        @inject('PaymentAnalyticsStrategyForVendor')
        private readonly _paymentStrategyForVendor: PaymentAnalyticsStrategyForVendor,
    ) { }

    getStrategy(role: TRole): IPaymentAnalyticsStrategy {
        switch (role) {
            case ROLES.ADMIN:
                return this._paymentStrategyForAdmin

            case ROLES.VENDOR:
                return this._paymentStrategyForVendor

            default:
                throw new CustomError(
                    ERROR_MESSAGES.INVALID_ROLE,
                    HTTP_STATUS.BAD_REQUEST,
                )
        }
    }
}
