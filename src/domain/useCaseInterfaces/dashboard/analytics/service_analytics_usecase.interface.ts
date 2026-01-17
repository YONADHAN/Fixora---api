import { DashboardStatsInputDTO } from '../../../../application/dtos/dashboard_dto'

export interface IServiceAnalyticsUseCase {
  execute(input: DashboardStatsInputDTO): Promise<any>
}
