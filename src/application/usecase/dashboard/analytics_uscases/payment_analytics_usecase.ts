import { injectable, inject } from 'tsyringe'
import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'
import { IPaymentAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/payment_analytics_usecase.interface'

@injectable()
export class PaymentAnalyticsUseCase implements IPaymentAnalyticsUseCase {
  constructor(
    @inject('')
    private readonly _paymentAnalysisFactory: IPaymentAnalysisFactory,
  ) {}
  async execute(input: DashboardStatsInputDTO): Promise<any> {
    const strategy = this._paymentAnalysisFactory.getStrategy(input.user.role)
    return await strategy.execute(input)
  }
}
