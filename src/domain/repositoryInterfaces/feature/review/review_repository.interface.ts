import { IReviewEntity } from '../../../models/review_entity'

export interface IReviewRepository {
    create(review: IReviewEntity): Promise<IReviewEntity>
    findByServiceId(
        serviceId: string,
        page: number,
        limit: number
    ): Promise<{ reviews: IReviewEntity[]; total: number }>
    findByBookingId(bookingId: string): Promise<IReviewEntity | null>
    calculateAverage(
        serviceId: string
    ): Promise<{ avgRating: number; totalRatings: number }>
    calculateAverageForVendor(
        vendorId: string
    ): Promise<{ avgRating: number; totalRatings: number }>
}
