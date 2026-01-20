import { inject, injectable } from 'tsyringe'
import {
  CustomerDashboardResponseDTO,
  DashboardStatsInputDTO,
} from '../../../dtos/dashboard_dto'
import { ICustomerAnalyticsStrategy } from './ICustomerAnalyticsStrategy'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'

@injectable()
export class CustomerAnalyticsStrategyForVendor implements ICustomerAnalyticsStrategy {
  constructor(
    @inject('ICustomerRepository')
    private readonly _customerRepository: ICustomerRepository,
    @inject('IVendorRepository')
    private readonly _vendorRepository: IVendorRepository,
  ) {}
  async execute(
    input: DashboardStatsInputDTO,
  ): Promise<CustomerDashboardResponseDTO> {
    const { from, to } = input.dateRange
    const vendor = await this._vendorRepository.findOne({
      userId: input.user.userId,
    })
    return await this._customerRepository.getCustomerDashboardAnalytics({
      from,
      to,
      interval: input.interval,
      vendorRef: vendor?._id?.toString(),
    })
  }
}
