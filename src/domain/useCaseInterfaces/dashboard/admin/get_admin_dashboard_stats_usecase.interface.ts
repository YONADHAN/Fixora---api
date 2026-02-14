import {
  AdminDashboardResponseDTO,
  DashboardStatsInputDTO,
} from '../../../../application/dtos/dashboard_dto'

export interface IGetAdminDashboardStatsUseCase {
  execute(input: DashboardStatsInputDTO): Promise<AdminDashboardResponseDTO>
}
