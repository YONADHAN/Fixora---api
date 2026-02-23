import {
  DashboardStatsInputDTO,
  VendorDashboardResponseDTO,
} from '../../../dtos/dashboard_dto'

export interface IVendorAnalyticsStrategy {
  execute(input: DashboardStatsInputDTO): Promise<VendorDashboardResponseDTO>
}
