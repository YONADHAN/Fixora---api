import { inject, injectable } from 'tsyringe'
import {
  DashboardStatsInputDTO,
  VendorDashboardResponseDTO,
} from '../../../dtos/dashboard_dto'
import { IVendorAnalyticsStrategy } from './IVendorAnalyticsStrategy'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
@injectable()
export class VendorAnalyticsStrategyForAdmin implements IVendorAnalyticsStrategy {
  constructor(
    @inject('IVendorRepository')
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(
    input: DashboardStatsInputDTO,
  ): Promise<VendorDashboardResponseDTO> {
    const { from, to } = input.dateRange

    return this.vendorRepository.getVendorDashboardAnalytics({
      from,
      to,
      interval: input.interval,
    })
  }
}
