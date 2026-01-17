import { DashboardStatsInputDTO } from '../../../../application/dtos/dashboard_dto'

export interface ICustomerAnalyticsUseCase {
  execute(input: DashboardStatsInputDTO): Promise<any>
}
