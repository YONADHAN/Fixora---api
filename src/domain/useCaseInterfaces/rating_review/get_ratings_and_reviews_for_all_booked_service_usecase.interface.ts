import {
  GetRatingsAndReviewsForBookedServicesRequestDTO,
  GetRatingsAndReviewsForBookedServicesResponseDTO,
} from '../../../application/dtos/rating_review_dto'

export interface IGetRatingsAndReviewsForAllBookedServicesUseCase {
  execute(
    input: GetRatingsAndReviewsForBookedServicesRequestDTO,
  ): Promise<GetRatingsAndReviewsForBookedServicesResponseDTO>
}
