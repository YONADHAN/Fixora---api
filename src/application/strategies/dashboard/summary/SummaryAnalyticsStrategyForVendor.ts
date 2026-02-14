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
export class SummaryAnalyticsStrategyForVendor implements ISummaryAnalyticsStrategy {
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
    const vendorId = input.user.userId
    const { from, to } = input.dateRange
    const vendorRef = await this.vendorRepository.findOne({
      userId: vendorId,
    })

    if (!vendorRef) {
      throw new Error('Vendor not found')
    }
    const vendorObjectId = vendorRef._id!.toString()

    const [
      activeCustomerCount,
      totalBookingCount,
      cancelledBookingCount,
      totalRevenueAmount,
    ] = await Promise.all([
      // Use booking repository to count unique customers for this vendor
      this.bookingRepository.countUniqueCustomersForVendor(vendorObjectId),
      this.bookingRepository.countDocuments({ vendorRef: vendorRef?._id }),
      this.bookingRepository.countDocuments({
        vendorRef: vendorRef?._id,
        serviceStatus: 'cancelled',
      }),
      this.paymentRepository.calculateTotalRevenue({
        from,
        to,
        vendorRef: vendorObjectId,
      }),
    ])

    return {
      blockedCustomers: 0, // Vendors cannot see global blocked count, and can't block customers themselves on platform level yet
      activeCustomers: activeCustomerCount,
      totalBookings: totalBookingCount,
      cancelledBookings: cancelledBookingCount,
      totalRevenue: totalRevenueAmount,
    }
  }
}
