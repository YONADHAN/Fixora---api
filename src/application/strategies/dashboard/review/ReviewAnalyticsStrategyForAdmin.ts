import { injectable } from 'tsyringe'
import { DashboardStatsInputDTO, ReviewAnalyticsDTO } from '../../../dtos/dashboard_dto'
import { IReviewAnalyticsStrategy } from './IReviewAnalyticsStrategy'

@injectable()
export class ReviewAnalyticsStrategyForAdmin implements IReviewAnalyticsStrategy {
    constructor() { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(_input: DashboardStatsInputDTO): Promise<ReviewAnalyticsDTO> {
        return {
            totalComments:0,
        }
    }
}
