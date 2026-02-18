import { injectable, inject } from 'tsyringe'
import {
  BookingDashboardResponseDTO,
  DashboardStatsInputDTO,
} from '../../../dtos/dashboard_dto'
import { IBookingAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/booking_analytics_usecase.interface'
import { IBookingAnalyticsFactory } from '../../../factories/dashboard/IBookingAnalyticsFactory'

@injectable()
export class BookingAnalyticsUseCase implements IBookingAnalyticsUseCase {
  constructor(
    @inject('IBookingAnalyticsFactory')
    private readonly _bookingAnalyticsFactory: IBookingAnalyticsFactory,
  ) { }
  async execute(
    input: DashboardStatsInputDTO,
  ): Promise<BookingDashboardResponseDTO> {
   
    const strategy = this._bookingAnalyticsFactory.getStrategy(input.user.role)
  
    return strategy.execute(input)
  }
}
