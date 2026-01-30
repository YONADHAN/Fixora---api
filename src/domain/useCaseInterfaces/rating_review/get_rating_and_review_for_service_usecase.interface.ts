export interface IGetRatingAndReviewForServiceUseCase {
  execute(
    input: GetRatingAndReviewForServiceRequestDTO,
  ): Promise<GetRatingAndReviewForServiceResponseDTO>
}

export interface GetRatingAndReviewForServiceRequestDTO {
  serviceId: string
  limit: number
  cursor?: string
}
export interface ReviewWithUserDTO {
  _id: string
  rating: number
  review: string
  createdAt: Date
  customer: {
    name: string
    profileImage?: string
  }
}

export interface GetRatingAndReviewForServiceResponseDTO {
  ratingsReviews: ReviewWithUserDTO[]
  nextCursor: string | null
}
