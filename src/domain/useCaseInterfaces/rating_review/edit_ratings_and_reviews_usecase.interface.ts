
export interface IEditRatingsAndReviewsUseCase {
    execute(input: EditRatingsAndReviewsRequestDTO): Promise<EditRatingsAndReviewsResponseDTO>
}

export interface EditRatingsAndReviewsRequestDTO {
    ratingsReviewId: string
    rating: number
    review: string
    customerId: string
}

export interface EditRatingsAndReviewsResponseDTO {
    ratingsReviewId: string
    rating: number
    review: string
}
