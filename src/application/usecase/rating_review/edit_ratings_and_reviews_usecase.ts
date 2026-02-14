import { inject, injectable } from 'tsyringe'
import { IRatingsReviewRepository } from '../../../domain/repositoryInterfaces/feature/ratings_review/ratings_review_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IEditRatingsAndReviewsUseCase, EditRatingsAndReviewsRequestDTO, EditRatingsAndReviewsResponseDTO } from '../../../domain/useCaseInterfaces/rating_review/edit_ratings_and_reviews_usecase.interface'

@injectable()
export class EditRatingsAndReviewsUseCase implements IEditRatingsAndReviewsUseCase {
  constructor(
    @inject('IRatingsReviewRepository')
    private readonly _ratingReviewRepository: IRatingsReviewRepository,
    @inject('ICustomerRepository')
    private readonly _customerRepository: ICustomerRepository,
  ) { }

  async execute(
    input: EditRatingsAndReviewsRequestDTO,
  ): Promise<EditRatingsAndReviewsResponseDTO> {
    const { ratingsReviewId, rating, review, customerId } = input
    const isExisting = await this._ratingReviewRepository.findOne({
      ratingsReviewId,
    })
    const customer = await this._customerRepository.findOne({ userId: customerId })
    if (!customer) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST,
      )
    }
    if (!isExisting) {
      throw new CustomError(
        'User not created the reviews and ratings yet.',
        HTTP_STATUS.NO_CONTENT,
      )
    }
    if (!customer._id) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST,
      )
    }
    if (isExisting.customerRef.toString() !== customer._id.toString()) {
      throw new CustomError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED,
      )
    }
    const response = await this._ratingReviewRepository.update(
      { ratingsReviewId },
      { rating, review },
    )
    if (!response) {
      throw new CustomError(
        'Failed to update the reviews and ratings.',
        HTTP_STATUS.BAD_REQUEST,
      )
    }
    return {
      ratingsReviewId: response.ratingsReviewId,
      rating: response.rating,
      review: response.review,


    }
  }
}
