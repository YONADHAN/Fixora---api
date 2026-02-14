import { inject, injectable } from 'tsyringe'
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  ROLES,
  TRole,
} from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { ISummaryAnalyticsFactory } from './ISummaryAnalyticsFactory'
import { ISummaryAnalyticsStrategy } from '../../strategies/dashboard/summary/ISummaryAnalyticsStrategy'
import { SummaryAnalyticsStrategyForAdmin } from '../../strategies/dashboard/summary/SummaryAnalyticsStrategyForAdmin'
import { SummaryAnalyticsStrategyForVendor } from '../../strategies/dashboard/summary/SummaryAnalyticsStrategyForVendor'

@injectable()
export class SummaryAnalyticsFactory implements ISummaryAnalyticsFactory {
  constructor(
    @inject('SummaryAnalyticsStrategyForAdmin')
    private readonly _summaryStrategyForAdmin: SummaryAnalyticsStrategyForAdmin,
    @inject('SummaryAnalyticsStrategyForVendor')
    private readonly _summaryStrategyForVendor: SummaryAnalyticsStrategyForVendor,
  ) {}

  getStrategy(role: TRole): ISummaryAnalyticsStrategy {
    switch (role) {
      case ROLES.ADMIN:
        return this._summaryStrategyForAdmin

      case ROLES.VENDOR:
        return this._summaryStrategyForVendor

      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST,
        )
    }
  }
}
