import { inject, injectable } from 'tsyringe'
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  ROLES,
  TRole,
} from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { IServiceAnalyticsFactory } from './IServiceAnalyticsFactory'
import { IServiceAnalyticsStrategy } from '../../strategies/dashboard/service/IServiceAnalyticsStrategy'
import { ServiceAnalyticsStrategyForAdmin } from '../../strategies/dashboard/service/ServiceAnalyticsStrategyForAdmin'

@injectable()
export class ServiceAnalyticsFactory implements IServiceAnalyticsFactory {
  constructor(
    @inject('ServiceAnalyticsStrategyForAdmin')
    private readonly _serviceStrategyForAdmin: ServiceAnalyticsStrategyForAdmin,
  ) {}

  getStrategy(role: TRole): IServiceAnalyticsStrategy {
    switch (role) {
      case ROLES.ADMIN:
        return this._serviceStrategyForAdmin

      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST,
        )
    }
  }
}
