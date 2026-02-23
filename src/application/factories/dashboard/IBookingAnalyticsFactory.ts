import { TRole } from '../../../shared/constants'
import { IBookingAnalyticsStrategy } from '../../strategies/dashboard/booking/IBookingAnalyticsStrategy'

export interface IBookingAnalyticsFactory {
    getStrategy(role: TRole): IBookingAnalyticsStrategy
}
