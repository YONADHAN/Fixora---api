import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'

export interface IReviewAnalyticsStrategy {
    execute(input: DashboardStatsInputDTO): Promise<any>
}
