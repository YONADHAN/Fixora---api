import { injectable, inject } from 'tsyringe'
import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'
import { IBookingAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/booking_analytics_usecase.interface'

@injectable()
export class BookingAnalyticsUseCase implements IBookingAnalyticsUseCase {
  constructor(
    @inject('')
    private readonly _bookingAnalyticsFactory: IBookingAnalyticsFactory;
  ) {}
  async execute(input: DashboardStatsInputDTO): Promise<any> {
    const strategy = await this._bookingAnalyticsFactory.getStrategy(input.user.role)
    return strategy.execute(input)
  }
}
