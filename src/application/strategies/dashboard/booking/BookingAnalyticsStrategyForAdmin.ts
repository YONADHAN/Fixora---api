import { inject, injectable } from 'tsyringe'
import {
  BookingDashboardResponseDTO,
  DashboardStatsInputDTO,
} from '../../../dtos/dashboard_dto'
import { IBookingAnalyticsStrategy } from './IBookingAnalyticsStrategy'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
@injectable()
export class BookingAnalyticsStrategyForAdmin implements IBookingAnalyticsStrategy {
  constructor(
    @inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(
    input: DashboardStatsInputDTO,
  ): Promise<BookingDashboardResponseDTO> {
    const { from, to } = input.dateRange

    return this.bookingRepository.getBookingDashboardAnalytics({
      from,
      to,
      interval: input.interval,
    })
  }
}
