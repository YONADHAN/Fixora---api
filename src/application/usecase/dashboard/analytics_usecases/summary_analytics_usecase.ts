import { injectable, inject } from 'tsyringe'
import {
  DashboardStatsInputDTO,
  SummaryAnalyticsResponseDTO,
} from '../../../dtos/dashboard_dto'
import { ISummaryAnalyticsUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/summary_usecase.interface'
import { ISummaryAnalyticsFactory } from '../../../factories/dashboard/ISummaryAnalyticsFactory'

@injectable()
export class SummaryAnalyticsUseCase implements ISummaryAnalyticsUseCase {
  constructor(
    @inject('ISummaryAnalyticsFactory')
    private readonly _summaryFactory: ISummaryAnalyticsFactory,
  ) {}

  async execute(
    input: DashboardStatsInputDTO,
  ): Promise<SummaryAnalyticsResponseDTO> {
    const strategy = this._summaryFactory.getStrategy(input.user.role)
    return strategy.execute(input)
  }
}
