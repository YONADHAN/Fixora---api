import { DashboardStatsInputDTO, PaymentAnalyticsDTO } from '../../../../application/dtos/dashboard_dto'

export interface IPaymentAnalyticsUseCase {
  execute(input: DashboardStatsInputDTO): Promise<PaymentAnalyticsDTO>
}
