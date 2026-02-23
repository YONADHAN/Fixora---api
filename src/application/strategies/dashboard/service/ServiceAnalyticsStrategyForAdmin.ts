import { inject, injectable } from 'tsyringe'
import {
  DashboardStatsInputDTO,
  ServiceDashboardResponseDTO,
} from '../../../dtos/dashboard_dto'
import { IServiceAnalyticsStrategy } from './IServiceAnalyticsStrategy'
import { IServiceRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
@injectable()
export class ServiceAnalyticsStrategyForAdmin implements IServiceAnalyticsStrategy {
  constructor(
    @inject('IServiceRepository')
    private readonly _serviceRepository: IServiceRepository,
  ) {}

  async execute(
    input: DashboardStatsInputDTO,
  ): Promise<ServiceDashboardResponseDTO> {
    const { from, to } = input.dateRange

    const [
      serviceGrowth,
      serviceStatusOverview,
      serviceUsageOverview,
      topServices,
    ] = await Promise.all([
      this._serviceRepository.getServiceGrowth({
        from,
        to,
        interval: input.interval,
      }),
      this._serviceRepository.getServiceStatusOverview(),
      this._serviceRepository.getServiceUsageOverview({ from, to }),
      this._serviceRepository.getTopServices({
        from,
        to,
        limit: 5,
      }),
    ])

    return {
      serviceGrowth,
      serviceStatusOverview,
      serviceUsageOverview,
      topServices,
    }
  }
}
