import { TRole } from '../../../shared/constants'
import { IPaymentAnalyticsStrategy } from '../../strategies/dashboard/payment/IPaymentAnalyticsStrategy'

export interface IPaymentAnalyticsFactory {
    getStrategy(role: TRole): IPaymentAnalyticsStrategy
}
