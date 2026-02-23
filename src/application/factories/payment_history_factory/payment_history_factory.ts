import { inject, injectable } from 'tsyringe'
import {
    IGetPaymentHistoryStrategy,
    IGetCustomerPaymentHistoryStrategy,
    IGetVendorPaymentHistoryStrategy
} from '../../strategies/payment/get_payment_history/get_payment_history_strategy.interface'

import { ROLES } from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import { IPaymentHistoryFactory } from './payment_history_factory.interface'
@injectable()
export class PaymentHistoryFactory implements IPaymentHistoryFactory {
    constructor(
        @inject('IGetCustomerPaymentHistoryStrategy')
        private readonly _customerPaymentHistoryStrategy: IGetCustomerPaymentHistoryStrategy,
        @inject('IGetVendorPaymentHistoryStrategy')
        private readonly _vendorPaymentHistoryStrategy: IGetVendorPaymentHistoryStrategy
    ) { }

    getStrategy(role: string): IGetPaymentHistoryStrategy {

        switch (role) {
            case ROLES.CUSTOMER:
                return this._customerPaymentHistoryStrategy
            case ROLES.VENDOR:
                return this._vendorPaymentHistoryStrategy
            default:
                throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.FORBIDDEN)
        }
    }
}
