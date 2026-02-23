import { inject, injectable } from 'tsyringe'
import {
  BookingDashboardResponseDTO,
  DashboardStatsInputDTO,
} from '../../../dtos/dashboard_dto'
import { IBookingAnalyticsStrategy } from './IBookingAnalyticsStrategy'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'

@injectable()
export class BookingAnalyticsStrategyForVendor implements IBookingAnalyticsStrategy {
  constructor(
    @inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
    @inject('IVendorRepository')
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(
    input: DashboardStatsInputDTO,
  ): Promise<BookingDashboardResponseDTO> {
    const { from, to } = input.dateRange
    const vendorId = input.user.userId
    const vendor = await this.vendorRepository.findOne({ userId: vendorId })
    return this.bookingRepository.getBookingDashboardAnalytics({
      from,
      to,
      interval: input.interval,
      vendorRef: vendor?._id?.toString(),
    })
  }
}
