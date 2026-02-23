import { injectable, inject } from 'tsyringe'
import {
  DashboardStatsInputDTO,
  VendorDashboardResponseDTO,
} from '../../../dtos/dashboard_dto'
import { IVendorAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/vendor_analytics_usecase.interface'
import { IVendorAnalyticsFactory } from '../../../factories/dashboard/IVendorAnalyticsFactory'

@injectable()
export class VendorAnalyticsUseCase implements IVendorAnalyticsUseCase {
  constructor(
    @inject('IVendorAnalyticsFactory')
    private readonly _vendorAnalyticsFactory: IVendorAnalyticsFactory,
  ) {}
  async execute(
    input: DashboardStatsInputDTO,
  ): Promise<VendorDashboardResponseDTO> {
    const strategy = this._vendorAnalyticsFactory.getStrategy(input.user.role)
    return await strategy.execute(input)
  }
}
