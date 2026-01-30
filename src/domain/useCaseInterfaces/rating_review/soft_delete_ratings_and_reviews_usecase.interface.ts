import { TRole } from '../../../shared/constants'

export interface ISoftDeleteRatingsAndReviews {
  execute(
    input: SoftDeleteRatingsAndReviewsRequestDTO,
  ): Promise<SoftDeleteRatingsAndReviewsResponseDTO>
}

export interface SoftDeleteRatingsAndReviewsRequestDTO {
  ratingsReviewId: string
  userId: string
  role: TRole
}

export interface SoftDeleteRatingsAndReviewsResponseDTO {
  ratingsReviewId: string
  rating: number
  review: string
  isActive: boolean
}
