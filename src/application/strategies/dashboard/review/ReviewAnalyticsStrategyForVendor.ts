import { injectable } from 'tsyringe'
import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'
import { IReviewAnalyticsStrategy } from './IReviewAnalyticsStrategy'

@injectable()
export class ReviewAnalyticsStrategyForVendor implements IReviewAnalyticsStrategy {
    constructor() { }
    async execute(input: DashboardStatsInputDTO): Promise<any> {
        return {}
    }
}
