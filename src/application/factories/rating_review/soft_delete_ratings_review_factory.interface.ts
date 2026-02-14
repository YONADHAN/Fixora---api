import { TRole } from '../../../shared/constants'
import { ISoftDeleteRatingsAndReviewsStrategy } from '../../strategies/rating_review/soft_delete_rating_review_strategy.interface'

export interface ISoftDeleteRatingsAndReviewsFactory {
  getStrategy(role: TRole): ISoftDeleteRatingsAndReviewsStrategy
}
