import {
  DashboardStatsInputDTO,
  VendorDashboardResponseDTO,
} from '../../../../application/dtos/dashboard_dto'

export interface IVendorAnalyticsUseCase {
  execute(input: DashboardStatsInputDTO): Promise<VendorDashboardResponseDTO>
}
