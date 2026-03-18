import { DashboardStatsInputDTO, ReviewAnalyticsDTO } from '../../../dtos/dashboard_dto'

export interface IReviewAnalyticsStrategy {
    execute(input: DashboardStatsInputDTO): Promise<ReviewAnalyticsDTO>
}
