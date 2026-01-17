import { injectable, inject } from 'tsyringe'
import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'
import { ICustomerAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/customer_analytics_usecase.interface'

@injectable()
class CustomerAnalyticsUseCase implements ICustomerAnalyticsUseCase {
    constructor(
        @inject('')
        private readonly _customerAnalyticsFactory: ICustomerAnalyticsFactory;
    ){}
  execute(input: DashboardStatsInputDTO): Promise<any> {
    const strategy = await this._customerAnalyticsFactory.getStrategy(
      input.user.role
    )
    return strategy.execute(input)
  }
}
