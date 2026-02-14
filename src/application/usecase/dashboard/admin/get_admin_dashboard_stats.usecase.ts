import { injectable, inject } from 'tsyringe'
import {
  AdminDashboardResponseDTO,
  DashboardStatsInputDTO,
} from '../../../dtos/dashboard_dto'
import { IGetAdminDashboardStatsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/admin/get_admin_dashboard_stats_usecase.interface'
import { ISummaryAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/summary_usecase.interface'
import { IBookingAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/booking_analytics_usecase.interface'
import { ICustomerAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/customer_analytics_usecase.interface'
import { IVendorAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/vendor_analytics_usecase.interface'
import { IServiceAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/service_analytics_usecase.interface'

@injectable()
export class GetAdminDashboardStatsUseCase implements IGetAdminDashboardStatsUseCase {
  constructor(
    @inject('ISummaryAnalyticsUseCase')
    private readonly _summaryStatsUseCase: ISummaryAnalyticsUseCase,

    // @inject('IPaymentAnalyticsUseCase')
    // private readonly _paymentAnalyticsUseCase: IPaymentAnalyticsUseCase,

    @inject('IBookingAnalyticsUseCase')
    private readonly _bookingAnalyticsUseCase: IBookingAnalyticsUseCase,

    @inject('IVendorAnalyticsUseCase')
    private readonly _vendorAnalyticsUseCase: IVendorAnalyticsUseCase,

    @inject('ICustomerAnalyticsUseCase')
    private readonly _customerAnalyticsUseCase: ICustomerAnalyticsUseCase,

    @inject('IServiceAnalyticsUseCase')
    private readonly _serviceAnalyticsUseCase: IServiceAnalyticsUseCase,

    // @inject('IReviewAnalyticsUseCase')
    // private readonly _reviewAnalyticsUseCase: IReviewAnalyticsUseCase,
  ) {}

  async execute(
    input: DashboardStatsInputDTO,
  ): Promise<AdminDashboardResponseDTO> {
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
    const [summary, booking, vendor, customer, service] = await Promise.all([
      this._summaryStatsUseCase.execute(input),
      this._bookingAnalyticsUseCase.execute(input),
      this._vendorAnalyticsUseCase.execute(input),
      this._customerAnalyticsUseCase.execute(input),
      this._serviceAnalyticsUseCase.execute(input),
    ])
    console.log(
      'The data from the backend api admin dashboard is ',
      summary,
      booking,
      vendor,
      customer,
      service,
    )
    return {
      summary,
      booking,
      vendor,
      customer,
      service,
    }
  }
}
