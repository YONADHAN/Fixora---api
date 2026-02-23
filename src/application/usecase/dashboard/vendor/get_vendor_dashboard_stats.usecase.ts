import { injectable, inject } from 'tsyringe'
import {
  DashboardStatsInputDTO,
  VendorDashboardStatsResponseDTO,
} from '../../../dtos/dashboard_dto'

import { ISummaryAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/summary_usecase.interface'
import { IBookingAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/booking_analytics_usecase.interface'
import { ICustomerAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/customer_analytics_usecase.interface'
import { IGetVendorDashboardStatsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/vendor/get_vendor_dashboard_status_usecase.interface'

@injectable()
export class GetVendorDashboardStatsUseCase implements IGetVendorDashboardStatsUseCase {
  constructor(
    @inject('ISummaryAnalyticsUseCase')
    private readonly _summaryStatsUseCase: ISummaryAnalyticsUseCase,

    @inject('IBookingAnalyticsUseCase')
    private readonly _bookingAnalyticsUseCase: IBookingAnalyticsUseCase,

    @inject('ICustomerAnalyticsUseCase')
    private readonly _customerAnalyticsUseCase: ICustomerAnalyticsUseCase,

    // @inject('IReviewAnalyticsUseCase')
    // private readonly _reviewAnalyticsUseCase: IReviewAnalyticsUseCase,
  ) {}

  async execute(
    input: DashboardStatsInputDTO,
  ): Promise<VendorDashboardStatsResponseDTO> {
    // const [summary, payment, booking, vendor, customer, service, review] =
    //   await Promise.all([
    //     this._summaryStatsUseCase.execute(input),
    //     this._paymentAnalyticsUseCase.execute(input),
    //     this._bookingAnalyticsUseCase.execute(input),
    //     this._vendorAnalyticsUseCase.execute(input),
    //     this._customerAnalyticsUseCase.execute(input),
    //     this._serviceAnalyticsUseCase.execute(input),
    //     this._reviewAnalyticsUseCase.execute(input),
    //   ])
    const [summary, booking, customer] = await Promise.all([
      this._summaryStatsUseCase.execute(input),
      this._bookingAnalyticsUseCase.execute(input),
      this._customerAnalyticsUseCase.execute(input),
    ])
    return {
      summary,
      booking,
      customer,
    }
  }
}
