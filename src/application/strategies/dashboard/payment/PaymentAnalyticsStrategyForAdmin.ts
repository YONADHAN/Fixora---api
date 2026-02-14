import { injectable } from 'tsyringe'
import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'
import { IPaymentAnalyticsStrategy } from './IPaymentAnalyticsStrategy'

@injectable()
export class PaymentAnalyticsStrategyForAdmin implements IPaymentAnalyticsStrategy {
    constructor() { }
    async execute(input: DashboardStatsInputDTO): Promise<any> {
        return {}
    }
}
