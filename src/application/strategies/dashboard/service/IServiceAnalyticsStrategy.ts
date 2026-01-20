import {
  DashboardStatsInputDTO,
  ServiceDashboardResponseDTO,
} from '../../../dtos/dashboard_dto'

export interface IServiceAnalyticsStrategy {
  execute(input: DashboardStatsInputDTO): Promise<ServiceDashboardResponseDTO>
}
