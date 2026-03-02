import { inject, injectable } from 'tsyringe'
import { IRatingsReviewRepository } from '../../../domain/repositoryInterfaces/feature/ratings_review/ratings_review_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'
import { ISoftDeleteRatingsAndReviewsByCustomerStrategy } from './soft_delete_rating_review_by_customer_strategy.interface'
import {
  SoftDeleteRatingsAndReviewsRequestDTO,
  SoftDeleteRatingsAndReviewsResponseDTO,
} from '../../dtos/rating_review_dto'

@injectable()
export class SoftDeleteRatingsAndReviewsByCustomerStrategy implements ISoftDeleteRatingsAndReviewsByCustomerStrategy {
  constructor(
    @inject('IRatingsReviewRepository')
    private readonly _ratingReviewRepository: IRatingsReviewRepository,
  ) {}
  async execute(
    input: SoftDeleteRatingsAndReviewsRequestDTO,
  ): Promise<SoftDeleteRatingsAndReviewsResponseDTO> {
    const { ratingsReviewId} = input
    console.log('Data for deletion ', input)
    const isRatingReviewExists = await this._ratingReviewRepository.findOne({
      ratingsReviewId,
    })
    if (!isRatingReviewExists) {
      throw new CustomError(
        'Rating and review is not existing.',
        HTTP_STATUS.BAD_REQUEST,
      )
    }

    const response = await this._ratingReviewRepository.update(
      { ratingsReviewId },
      { isActive: false },
    )
    if (!response) {
      throw new CustomError(
        'Rating and review is not existing.',
        HTTP_STATUS.BAD_REQUEST,
      )
    }
    return {
      ratingsReviewId,
      rating: response?.rating,
      review: response?.review,
      isActive: response?.isActive,
    }
  }
}
