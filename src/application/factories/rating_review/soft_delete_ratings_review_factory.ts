import { inject, injectable } from 'tsyringe'
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  ROLES,
  TRole,
} from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { ISoftDeleteRatingsAndReviewsByCustomerStrategy } from '../../strategies/rating_review/soft_delete_rating_review_by_customer_strategy.interface'
import { ISoftDeleteRatingsAndReviewsByAdminStrategy } from '../../strategies/rating_review/soft_delete_rating_review_by_admin_strategy.interface'
import { ISoftDeleteRatingsAndReviewsFactory } from './soft_delete_ratings_review_factory.interface'

@injectable()
export class SoftDeleteRatingsAndReviewsFactory implements ISoftDeleteRatingsAndReviewsFactory {
  constructor(
    @inject('ISoftDeleteRatingsAndReviewsByCustomerStrategy')
    private readonly _softDeleteRatingsAndReviewByCustomerStrategy: ISoftDeleteRatingsAndReviewsByCustomerStrategy,
    @inject('ISoftDeleteRatingsAndReviewsByAdminStrategy')
    private readonly _softDeleteRatingsAndReviewByAdminStrategy: ISoftDeleteRatingsAndReviewsByAdminStrategy,
  ) {}
  getStrategy(role: TRole) {
    switch (role) {
      case ROLES.CUSTOMER:
        return this._softDeleteRatingsAndReviewByCustomerStrategy
      case ROLES.ADMIN:
        return this._softDeleteRatingsAndReviewByAdminStrategy
      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST,
        )
    }
  }
}
