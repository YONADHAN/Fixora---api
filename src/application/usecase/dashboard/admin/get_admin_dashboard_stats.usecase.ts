import { injectable, inject } from 'tsyringe'
import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'
import { IGetAdminDashboardStatusUseCase } from '../../../../domain/useCaseInterfaces/dashboard/admin/get_admin_dashboard_stats_usecase.interface'
//usecase imports from di

@injectable()
export class GetAdminDashboardStatusUseCase
  implements IGetAdminDashboardStatusUseCase
{
  constructor(
    @inject('IAdminSummaryStatusUseCase')
    private readonly _summaryStatsUseCase: ISummaryStatsUseCase,

    @inject('IPaymentAnalyticsUseCase')
    private readonly _paymentAnalyticsUseCase: IPaymentAnalyticsUseCase,

    @inject('IBookingAnalyticsUseCase')
    private readonly _bookingAnalyticsUseCase: IBookingAnalyticsUseCase,

    @inject('IVendorAnalyticsUseCase')
    private readonly _vendorAnalyticsUseCase: IVendorAnalyticsUseCase,

    @inject('ICustomerAnalyticsUseCase')
    private readonly _customerAnalyticsUseCase: ICustomerAnalyticsUseCase,

    @inject('IServiceAnalyticsUseCase')
    private readonly _serviceAnalyticsUseCase: IServiceAnalyticsUseCase,

    @inject('IReviewAnalyticsUseCase')
    private readonly _reviewAnalyticsUseCase: IReviewAnalyticsUseCase
  ) {}

  async execute(input: DashboardStatsInputDTO): Promise<any> {
    const [summary, payment, booking, vendor, customer, service, review] =
      await Promise.all([
        this._summaryStatsUseCase.execute(input),
        this._paymentAnalyticsUseCase.execute(input),
        this._bookingAnalyticsUseCase.execute(input),
        this._vendorAnalyticsUseCase.execute(input),
        this._customerAnalyticsUseCase.execute(input),
        this._serviceAnalyticsUseCase.execute(input),
        this._reviewAnalyticsUseCase.execute(input),
      ])

    return {
      summary,
      payment,
      booking,
      vendor,
      customer,
      service,
      review,
    }
  }
}
