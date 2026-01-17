import { injectable, inject } from 'tsyringe'
import { DashboardStatsInputDTO } from '../../../dtos/dashboard_dto'
import { ISummaryUseCase } from '../../../../domain/useCaseInterfaces/dashboard/analytics/summary_usecase.interface'

@injectable()
export class SummaryUseCase implements ISummaryUseCase {
  constructor(
    @inject('')
    private readonly _summaryFactory: ISummaryFactory;
  ) {}
  async execute(input: DashboardStatsInputDTO): Promise<any> {
    const strategy = this._summaryFactory.getStrategy(input.user.role)
    return strategy.execute(input)
  }
}
