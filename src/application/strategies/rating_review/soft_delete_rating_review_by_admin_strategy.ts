import { inject, injectable } from 'tsyringe'
import { IRatingsReviewRepository } from '../../../domain/repositoryInterfaces/feature/ratings_review/ratings_review_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS, ERROR_MESSAGES } from '../../../shared/constants'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import {
  SoftDeleteRatingsAndReviewsRequestDTO,
  SoftDeleteRatingsAndReviewsResponseDTO,
} from '../../dtos/rating_review_dto'
import { ISoftDeleteRatingsAndReviewsByAdminStrategy } from './soft_delete_rating_review_by_admin_strategy.interface'

@injectable()
export class SoftDeleteRatingsAndReviewsByAdminStrategy implements ISoftDeleteRatingsAndReviewsByAdminStrategy {
  constructor(
    @inject('IRatingsReviewRepository')
    private readonly _ratingReviewRepository: IRatingsReviewRepository,
    @inject('IVendorRepository')
    private readonly _vendorRepository: IVendorRepository,
  ) {}
  async execute(
    input: SoftDeleteRatingsAndReviewsRequestDTO,
  ): Promise<SoftDeleteRatingsAndReviewsResponseDTO> {
    const { ratingsReviewId } = input
    
    const isRatingReviewExists = await this._ratingReviewRepository.findOne({
      ratingsReviewId,
    })
    if (!isRatingReviewExists) {
      throw new CustomError(
        ERROR_MESSAGES.RATING_AND_REVIEW_IS_NOT_EXISTING,
        HTTP_STATUS.BAD_REQUEST,
      )
    }

    const response = await this._ratingReviewRepository.update(
      { ratingsReviewId },
      { isActive: false },
    )
    if (!response) {
      throw new CustomError(ERROR_MESSAGES.ERROR_MESSAGES_ERROR_IN_DELETION, HTTP_STATUS.NOT_IMPLEMENTED)
    }

    return {
      ratingsReviewId: response.ratingsReviewId,
      rating: response.rating,
      review: response.review,
      isActive: response.isActive,
    }
  }
}
