import { TRole } from '../../../shared/constants'
import { ISummaryAnalyticsStrategy } from '../../strategies/dashboard/summary/ISummaryAnalyticsStrategy'

export interface ISummaryAnalyticsFactory {
    getStrategy(role: TRole): ISummaryAnalyticsStrategy
}
