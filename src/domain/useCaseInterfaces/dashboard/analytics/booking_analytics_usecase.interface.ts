import {
  BookingDashboardResponseDTO,
  DashboardStatsInputDTO,
} from '../../../../application/dtos/dashboard_dto'

export interface IBookingAnalyticsUseCase {
  execute(input: DashboardStatsInputDTO): Promise<BookingDashboardResponseDTO>
}
