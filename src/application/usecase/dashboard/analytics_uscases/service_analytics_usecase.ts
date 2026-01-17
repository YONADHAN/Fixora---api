import { injectable, inject } from 'tsyringe'
import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'
import { IServiceAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/service_analytics_usecase.interface'

@injectable()
export class ServiceAnalyticsUseCase implements IServiceAnalyticsUseCase {
  constructor(
    @inject('')
    private readonly _serviceAnalyticsFactory: IServiceAnalyticsFactory
  ) {}

  async execute(input: DashboardStatsInputDTO): Promise<any> {
    const strategy = this._serviceAnalyticsFactory.getStratgy(input.user.role)
    return await strategy.execute(input)
  }
}
