import { CustomerDashboardStatsResponseDTO, DashboardStatsInputDTO} from "../../../../application/dtos/dashboard_dto";

export interface IGetCustomerDashboardStatsUseCase {
    execute(
        input: DashboardStatsInputDTO,
      ): Promise<CustomerDashboardStatsResponseDTO>
}