import { TRole } from '../../../shared/constants'
import { IReviewAnalyticsStrategy } from '../../strategies/dashboard/review/IReviewAnalyticsStrategy'

export interface IReviewAnalyticsFactory {
    getStrategy(role: TRole): IReviewAnalyticsStrategy
}
