import { injectable, inject } from 'tsyringe'
import {
  DashboardStatsInputDTO,
  ServiceDashboardResponseDTO,
} from '../../../dtos/dashboard_dto'
import { IServiceAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/service_analytics_usecase.interface'
import { IServiceAnalyticsFactory } from '../../../factories/dashboard/IServiceAnalyticsFactory'

@injectable()
export class ServiceAnalyticsUseCase implements IServiceAnalyticsUseCase {
  constructor(
    @inject('IServiceAnalyticsFactory')
    private readonly _serviceAnalyticsFactory: IServiceAnalyticsFactory,
  ) {}

  async execute(
    input: DashboardStatsInputDTO,
  ): Promise<ServiceDashboardResponseDTO> {
    const strategy = this._serviceAnalyticsFactory.getStrategy(input.user.role)
    return strategy.execute(input)
  }
}
