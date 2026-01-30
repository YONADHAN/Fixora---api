import { inject, injectable } from 'tsyringe'
import { IRatingsReviewRepository } from '../../../domain/repositoryInterfaces/feature/ratings_review/ratings_review_repository.interface'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import {
  GetRatingAndReviewForServiceRequestDTO,
  GetRatingAndReviewForServiceResponseDTO,
  IGetRatingAndReviewForServiceUseCase,
} from '../../../domain/useCaseInterfaces/rating_review/get_rating_and_review_for_service_usecase.interface'
@injectable()
export class GetRatingAndReviewForServiceUseCase implements IGetRatingAndReviewForServiceUseCase {
  constructor(
    @inject('IRatingsReviewRepository')
    private readonly _ratingsReviewRepository: IRatingsReviewRepository,
    @inject('IServiceRepository')
    private readonly _serviceRepository: IServiceRepository,
  ) {}

  async execute(
    input: GetRatingAndReviewForServiceRequestDTO,
  ): Promise<GetRatingAndReviewForServiceResponseDTO> {
    const { serviceId, limit, cursor } = input

    const service = await this._serviceRepository.findOne({ serviceId })
    if (!service?._id) {
      throw new CustomError(
        ERROR_MESSAGES.SERVICES_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    const serviceRef = service._id.toString()

    const reviews = await this._ratingsReviewRepository.findByServicePaginated(
      serviceRef,
      limit,
      cursor,
    )

    let nextCursor: string | null = null

    if (reviews.length > limit) {
      const last = reviews.pop()
      nextCursor = last?._id ?? null
    }

    return {
      ratingsReviews: reviews,
      nextCursor,
    }
  }
}
