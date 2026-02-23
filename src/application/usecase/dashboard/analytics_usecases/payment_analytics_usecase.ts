import { injectable, inject } from 'tsyringe'
import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'
import { IPaymentAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/payment_analytics_usecase.interface'
import { IPaymentAnalyticsFactory } from '../../../factories/dashboard/IPaymentAnalyticsFactory'

@injectable()
export class PaymentAnalyticsUseCase implements IPaymentAnalyticsUseCase {
  constructor(
    @inject('PaymentAnalyticsFactory')
    private readonly _paymentAnalyticsFactory: IPaymentAnalyticsFactory,
  ) { }
  async execute(input: DashboardStatsInputDTO): Promise<any> {
    const strategy = this._paymentAnalyticsFactory.getStrategy(input.user.role)
    return strategy.execute(input)
  }
}
