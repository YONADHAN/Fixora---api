import { IReviewEntity } from '../../models/review_entity'

export interface GetServiceReviewsOutput {
    avgRating: number
    totalRatings: number
    reviews: IReviewEntity[]
    currentPage: number
    totalPages: number
}

export interface IGetServiceReviewsUseCase {
    execute(
        serviceId: string,
        page: number,
        limit: number
    ): Promise<GetServiceReviewsOutput>
}
