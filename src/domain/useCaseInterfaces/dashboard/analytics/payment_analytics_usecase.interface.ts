import { DashboardStatsInputDTO } from '../../../../application/dtos/dashboard_dto'

export interface IPaymentAnalyticsUseCase {
  execute(input: DashboardStatsInputDTO): Promise<any>
}
