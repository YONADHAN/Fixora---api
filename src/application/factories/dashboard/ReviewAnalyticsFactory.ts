import { inject, injectable } from 'tsyringe'
import {
    ERROR_MESSAGES,
    HTTP_STATUS,
    ROLES,
    TRole,
} from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { IReviewAnalyticsFactory } from './IReviewAnalyticsFactory'
import { IReviewAnalyticsStrategy } from '../../strategies/dashboard/review/IReviewAnalyticsStrategy'
import { ReviewAnalyticsStrategyForAdmin } from '../../strategies/dashboard/review/ReviewAnalyticsStrategyForAdmin'
import { ReviewAnalyticsStrategyForVendor } from '../../strategies/dashboard/review/ReviewAnalyticsStrategyForVendor'

@injectable()
export class ReviewAnalyticsFactory implements IReviewAnalyticsFactory {
    constructor(
        @inject('ReviewAnalyticsStrategyForAdmin')
        private readonly _reviewStrategyForAdmin: ReviewAnalyticsStrategyForAdmin,
        @inject('ReviewAnalyticsStrategyForVendor')
        private readonly _reviewStrategyForVendor: ReviewAnalyticsStrategyForVendor,
    ) { }

    getStrategy(role: TRole): IReviewAnalyticsStrategy {
        switch (role) {
            case ROLES.ADMIN:
                return this._reviewStrategyForAdmin

            case ROLES.VENDOR:
                return this._reviewStrategyForVendor

            default:
                throw new CustomError(
                    ERROR_MESSAGES.INVALID_ROLE,
                    HTTP_STATUS.BAD_REQUEST,
                )
        }
    }
}
