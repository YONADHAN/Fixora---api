import { DashboardStatsInputDTO } from '../../../../application/dtos/dashboard_dto'

export interface ISummaryUseCase {
  execute(input: DashboardStatsInputDTO): Promise<any>
}
