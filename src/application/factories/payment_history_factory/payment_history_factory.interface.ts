import { IGetPaymentHistoryStrategy } from '../../strategies/payment/get_payment_history/get_payment_history_strategy.interface'

export interface IPaymentHistoryFactory {
    getStrategy(role: string): IGetPaymentHistoryStrategy
}
