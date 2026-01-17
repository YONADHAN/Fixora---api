import { DashboardStatsInputDTO } from '../../../../application/dtos/dashboard_dto'

export interface IGetAdminDashboardStatusUseCase {
  execute(input: DashboardStatsInputDTO): Promise<any>
}
