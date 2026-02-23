import {
  DashboardStatsInputDTO,
  VendorDashboardStatsResponseDTO,
} from '../../../../application/dtos/dashboard_dto'

export interface IGetVendorDashboardStatsUseCase {
  execute(
    input: DashboardStatsInputDTO,
  ): Promise<VendorDashboardStatsResponseDTO>
}
