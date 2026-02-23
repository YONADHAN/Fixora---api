import {
  BookingDashboardResponseDTO,
  DashboardStatsInputDTO,
} from '../../../dtos/dashboard_dto'

export interface IBookingAnalyticsStrategy {
  execute(input: DashboardStatsInputDTO): Promise<BookingDashboardResponseDTO>
}
