import { injectable } from 'tsyringe'
import { DashboardStatsInputDTO, ReviewAnalyticsDTO } from '../../../dtos/dashboard_dto'
import { IReviewAnalyticsStrategy } from './IReviewAnalyticsStrategy'

@injectable()
export class ReviewAnalyticsStrategyForVendor implements IReviewAnalyticsStrategy {
    constructor() { }
   
    async execute(
        _input: DashboardStatsInputDTO): Promise<ReviewAnalyticsDTO> {
            console.log("Input",_input)
        return {
            totalComments:0
        }
    }
}
