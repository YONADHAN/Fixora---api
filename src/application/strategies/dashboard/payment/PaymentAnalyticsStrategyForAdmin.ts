import { injectable } from 'tsyringe'
import { DashboardStatsInputDTO, PaymentAnalyticsDTO } from '../../../dtos/dashboard_dto'
import { IPaymentAnalyticsStrategy } from './IPaymentAnalyticsStrategy'

@injectable()
export class PaymentAnalyticsStrategyForAdmin implements IPaymentAnalyticsStrategy {
    constructor() { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(_input: DashboardStatsInputDTO): Promise<PaymentAnalyticsDTO> {
        return {
            totalRevenue: 0,
            totalTransactions: 0,
            successRate: 0,
        }
    }
}
