import { DashboardStatsInputDTO, PaymentAnalyticsDTO } from '../../../dtos/dashboard_dto'

export interface IPaymentAnalyticsStrategy {
    execute(input: DashboardStatsInputDTO): Promise<PaymentAnalyticsDTO>
}
