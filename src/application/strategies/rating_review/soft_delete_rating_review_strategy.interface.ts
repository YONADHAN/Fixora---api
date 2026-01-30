import { SoftDeleteRatingsAndReviewsRequestDTO, SoftDeleteRatingsAndReviewsResponseDTO } from "../../dtos/rating_review_dto";

export interface ISoftDeleteRatingsAndReviewsStrategy {
    execute(input: SoftDeleteRatingsAndReviewsRequestDTO): Promise<SoftDeleteRatingsAndReviewsResponseDTO>
}