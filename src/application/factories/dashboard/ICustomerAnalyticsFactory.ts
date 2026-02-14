import { TRole } from '../../../shared/constants'
import { ICustomerAnalyticsStrategy } from '../../strategies/dashboard/customer/ICustomerAnalyticsStrategy'

export interface ICustomerAnalyticsFactory {
    getStrategy(role: TRole): ICustomerAnalyticsStrategy
}
