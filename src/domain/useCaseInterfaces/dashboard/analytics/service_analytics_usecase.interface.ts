import {
  DashboardStatsInputDTO,
  ServiceDashboardResponseDTO,
} from '../../../../application/dtos/dashboard_dto'

export interface IServiceAnalyticsUseCase {
  execute(input: DashboardStatsInputDTO): Promise<ServiceDashboardResponseDTO>
}
