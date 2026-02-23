import { inject, injectable } from 'tsyringe'
import {
  DashboardStatsInputDTO,
  SummaryAnalyticsResponseDTO,
} from '../../../dtos/dashboard_dto'
import { ISummaryAnalyticsStrategy } from './ISummaryAnalyticsStrategy'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IPaymentRepository } from '../../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
@injectable()
export class SummaryAnalyticsStrategyForAdmin implements ISummaryAnalyticsStrategy {
  constructor(
    @inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,

    @inject('IVendorRepository')
    private readonly vendorRepository: IVendorRepository,

    @inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,

    @inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
  ) { }

  async execute(
    input: DashboardStatsInputDTO,
  ): Promise<SummaryAnalyticsResponseDTO> {
    const { from, to } = input.dateRange

    const [
      blockedCustomerCount,
      activeCustomerCount,
      blockedVendorCount,
      activeVendorCount,
      totalBookingCount,
      cancelledBookingCount,
      totalRevenueAmount,
    ] = await Promise.all([
      this.customerRepository.countDocuments({ status: 'blocked' }),
      this.customerRepository.countDocuments({ status: 'active' }),
      this.vendorRepository.countDocuments({ status: 'blocked' }),
      this.vendorRepository.countDocuments({ status: 'active' }),
      this.bookingRepository.countDocuments({}),
      this.bookingRepository.countDocuments({ serviceStatus: 'cancelled' }),
      this.paymentRepository.calculateTotalRevenue({ from, to }),
    ])

    const totalActiveUsersCount = activeCustomerCount + activeVendorCount

    return {
      totalActiveUsers: totalActiveUsersCount,
      blockedCustomers: blockedCustomerCount,
      activeCustomers: activeCustomerCount,
      blockedVendors: blockedVendorCount,
      activeVendors: activeVendorCount,
      totalBookings: totalBookingCount,
      cancelledBookings: cancelledBookingCount,
      totalRevenue: totalRevenueAmount,
    }
  }
}
