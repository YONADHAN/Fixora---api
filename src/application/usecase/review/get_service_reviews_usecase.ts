import { inject, injectable } from 'tsyringe'
import {
    IGetServiceReviewsUseCase,
    GetServiceReviewsOutput,
} from '../../../domain/useCaseInterfaces/review/get_service_reviews_usecase.interface'
import { IReviewRepository } from '../../../domain/repositoryInterfaces/feature/review/review_repository.interface'

@injectable()
export class GetServiceReviewsUseCase implements IGetServiceReviewsUseCase {
    constructor(
        @inject('IReviewRepository') private reviewRepository: IReviewRepository
    ) { }

    async execute(
        serviceId: string,
        page: number,
        limit: number
    ): Promise<GetServiceReviewsOutput> {
        const { reviews, total } = await this.reviewRepository.findByServiceId(
            serviceId,
            page,
            limit
        )

        const stats = await this.reviewRepository.calculateAverage(serviceId)

        return {
            avgRating: stats.avgRating,
            totalRatings: stats.totalRatings,
            reviews,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        }
    }
}
