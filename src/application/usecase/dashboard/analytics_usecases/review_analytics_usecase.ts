import { injectable, inject } from 'tsyringe'
import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'
import { IReviewAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/review_analytics_usecase.interface'
import { IReviewAnalyticsFactory } from '../../../factories/dashboard/IReviewAnalyticsFactory'

@injectable()
export class ReviewAnalyticsUseCase implements IReviewAnalyticsUseCase {
  constructor(
    @inject('ReviewAnalyticsFactory')
    private readonly _reviewAnalyticsFactory: IReviewAnalyticsFactory
  ) { }
  async execute(input: DashboardStatsInputDTO): Promise<any> {
    const strategy = this._reviewAnalyticsFactory.getStrategy(input.user.role)
    return strategy.execute(input)
  }
}
