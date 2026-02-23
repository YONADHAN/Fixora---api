import { inject, injectable } from 'tsyringe'
import {
  ISoftDeleteRatingsAndReviews,
  SoftDeleteRatingsAndReviewsRequestDTO,
  SoftDeleteRatingsAndReviewsResponseDTO,
} from '../../../domain/useCaseInterfaces/rating_review/soft_delete_ratings_and_reviews_usecase.interface'
import { ISoftDeleteRatingsAndReviewsFactory } from '../../factories/rating_review/soft_delete_ratings_review_factory.interface'

@injectable()
export class SoftDeleteRatingsAndReviewsUseCase implements ISoftDeleteRatingsAndReviews {
  constructor(
    @inject('ISoftDeleteRatingsAndReviewsFactory')
    private readonly _softDeleteRatingsReviewFactory: ISoftDeleteRatingsAndReviewsFactory,
  ) {}
  async execute(
    input: SoftDeleteRatingsAndReviewsRequestDTO,
  ): Promise<SoftDeleteRatingsAndReviewsResponseDTO> {
    const { role } = input
    console.log('before strategy role', role)
    const strategy = this._softDeleteRatingsReviewFactory.getStrategy(role)
    return strategy.execute(input)
  }
}
