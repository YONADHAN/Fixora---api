import { injectable, inject } from 'tsyringe'
import {
  CustomerDashboardResponseDTO,
  DashboardStatsInputDTO,
} from '../../../dtos/dashboard_dto'
import { ICustomerAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/customer_analytics_usecase.interface'
import { ICustomerAnalyticsFactory } from '../../../factories/dashboard/ICustomerAnalyticsFactory'

@injectable()
export class CustomerAnalyticsUseCase implements ICustomerAnalyticsUseCase {
  constructor(
    @inject('ICustomerAnalyticsFactory')
    private readonly _customerAnalyticsFactory: ICustomerAnalyticsFactory,
  ) {}
  execute(
    input: DashboardStatsInputDTO,
  ): Promise<CustomerDashboardResponseDTO> {
    const strategy = this._customerAnalyticsFactory.getStrategy(input.user.role)
    return strategy.execute(input)
  }
}
