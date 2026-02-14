import {
  DashboardStatsInputDTO,
  SummaryAnalyticsResponseDTO,
} from '../../../dtos/dashboard_dto'

export interface ISummaryAnalyticsStrategy {
  execute(input: DashboardStatsInputDTO): Promise<SummaryAnalyticsResponseDTO>
}
