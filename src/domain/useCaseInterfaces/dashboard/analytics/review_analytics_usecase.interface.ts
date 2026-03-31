import { DashboardStatsInputDTO, ReviewAnalyticsDTO } from '../../../../application/dtos/dashboard_dto'

export interface IReviewAnalyticsUseCase {
  execute(input: DashboardStatsInputDTO): Promise<ReviewAnalyticsDTO>
}
