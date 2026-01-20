import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'

export interface IPaymentAnalyticsStrategy {
    execute(input: DashboardStatsInputDTO): Promise<any>
}
