import { injectable, inject } from 'tsyringe'
import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'

@injectable()
export class VendorAnalyticsUseCase implements IVendorAnalyticsUseCase {
  constructor(
    @inject('')
    private readonly _vendorAnalyticsFactory: IVendorAnalyticsFactory
  ) {}
  async execute(input: DashboardStatsInputDTO): Promise<any> {
    const strategy = this._vendorAnalyticsFactory.getStrategy(input.user.role)
    return await strategy.execute(input)
  }
}
