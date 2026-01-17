import { IReviewEntity } from '../../models/review_entity'

export interface CreateReviewDto {
    serviceId: string
    bookingId: string
    vendorId: string // Will be fetched from booking ideally, but can be passed for validation
    customerId: string // From Auth Token
    rating: number
    comment: string
}

export interface ICreateReviewUseCase {
    execute(data: CreateReviewDto): Promise<IReviewEntity>
}
