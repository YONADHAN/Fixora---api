import {
  CustomerDashboardResponseDTO,
  DashboardStatsInputDTO,
} from '../../../dtos/dashboard_dto'

export interface ICustomerAnalyticsStrategy {
  execute(input: DashboardStatsInputDTO): Promise<CustomerDashboardResponseDTO>
}
