import { inject, injectable } from 'tsyringe'
import { IRatingsReviewRepository } from '../../../domain/repositoryInterfaces/feature/ratings_review/ratings_review_repository.interface'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import {
  ICreateRatingsAndReviewsUseCase,
  CreateRatingsAndReviewsRequestDTO,
  CreateRatingsAndReviewsResponseDTO,
} from '../../../domain/useCaseInterfaces/rating_review/create_ratings_and_reviews_usecase.interface'
import { generateUniqueId } from '../../../shared/utils/unique_uuid.helper'

@injectable()
export class CreateRatingsAndReviewsUseCase implements ICreateRatingsAndReviewsUseCase {
  constructor(
    @inject('IRatingsReviewRepository')
    private readonly _ratingsReviewRepository: IRatingsReviewRepository,
    @inject('ICustomerRepository')
    private readonly _customerRepository: ICustomerRepository,
    @inject('IServiceRepository')
    private readonly _serviceRepository: IServiceRepository,
  ) {}
  async execute(
    input: CreateRatingsAndReviewsRequestDTO,
  ): Promise<CreateRatingsAndReviewsResponseDTO> {
    const { rating, review, serviceId, customerId } = input
    console.log('Input is ', input)
    const customer = await this._customerRepository.findOne({
      userId: customerId,
    })
    const service = await this._serviceRepository.findOne({ serviceId })
    const serviceRef = service?._id
    const customerRef = customer?._id
    if (!serviceRef) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.BAD_REQUEST,
      )
    }
    if (!customerRef) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.BAD_REQUEST,
      )
    }

    const isExistingRatingsAndReviewsDoneByCustomer =
      await this._ratingsReviewRepository.findByServiceAndCustomer(
        serviceRef.toString(),
        customerRef.toString(),
      )

    if (isExistingRatingsAndReviewsDoneByCustomer) {
      throw new CustomError(
        'Reviews and Ratings already exists',
        HTTP_STATUS.BAD_REQUEST,
      )
    }
    console.log('before saving')
    const response = await this._ratingsReviewRepository.save({
      ratingsReviewId: generateUniqueId(),
      rating,
      review,
      serviceRef: serviceRef?.toString(),
      customerRef: customerRef?.toString(),
      isActive: true,
    })

    return response
  }
}
