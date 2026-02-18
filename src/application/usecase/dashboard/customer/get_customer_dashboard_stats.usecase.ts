import {inject,injectable} from 'tsyringe'
import {

    CustomerDashboardStatsResponseDTO,
    DashboardStatsInputDTO,

} from '../../../dtos/dashboard_dto'
import { ISummaryAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/summary_usecase.interface'
import { IBookingAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/booking_analytics_usecase.interface'
import { IGetCustomerDashboardStatsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/customer/get_customer_dashboard_status_usecase.interface'



@injectable()
export class GetCustomerDashboardStatsUseCase implements IGetCustomerDashboardStatsUseCase  {
    constructor(
        @inject('ISummaryAnalyticsUseCase')
          private readonly _summaryStatsUseCase: ISummaryAnalyticsUseCase,
      
          @inject('IBookingAnalyticsUseCase')
          private readonly _bookingAnalyticsUseCase: IBookingAnalyticsUseCase,
    ){}

    async execute(input: DashboardStatsInputDTO): Promise<CustomerDashboardStatsResponseDTO> {
       
        const [summary, booking] = await Promise.all([
            this._summaryStatsUseCase.execute(input),
            this._bookingAnalyticsUseCase.execute(input),
        ])
        return {
            summary,
            booking,
        }
    }
}