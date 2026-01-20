import {
  DashboardStatsInputDTO,
  SummaryAnalyticsResponseDTO,
} from '../../../../application/dtos/dashboard_dto'

export interface ISummaryAnalyticsUseCase {
  execute(input: DashboardStatsInputDTO): Promise<SummaryAnalyticsResponseDTO>
}
