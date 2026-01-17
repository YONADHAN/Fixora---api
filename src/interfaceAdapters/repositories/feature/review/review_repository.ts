import { injectable } from 'tsyringe'
import { BaseRepository } from '../../base_repository'
import { IReviewRepository } from '../../../../domain/repositoryInterfaces/feature/review/review_repository.interface'
import { IReviewEntity } from '../../../../domain/models/review_entity'
import { IReviewModel, ReviewModel } from '../../../database/mongoDb/models/review_model'

@injectable()
export class ReviewRepository
    extends BaseRepository<IReviewModel, IReviewEntity>
    implements IReviewRepository {
    constructor() {
        super(ReviewModel)
    }

    protected toEntity(model: IReviewModel | any): IReviewEntity {
        return {
            _id: model._id.toString(),
            reviewId: model.reviewId,
            bookingId: model.bookingId,
            serviceId: model.serviceId,
            customerId: model.customerId,
            vendorId: model.vendorId,
            rating: model.rating,
            comment: model.comment,
            createdAt: model.createdAt,
            isDeleted: model.isDeleted,
        }
    }

    protected toModel(entity: Partial<IReviewEntity>): Partial<IReviewModel> {
        return {
            reviewId: entity.reviewId,
            bookingId: entity.bookingId,
            serviceId: entity.serviceId,
            customerId: entity.customerId,
            vendorId: entity.vendorId,
            rating: entity.rating,
            comment: entity.comment,
            isDeleted: entity.isDeleted,
        }
    }

    async create(review: IReviewEntity): Promise<IReviewEntity> {
        const created = await this.model.create(this.toModel(review))
        return this.toEntity(created)
    }

    async findByServiceId(
        serviceId: string,
        page: number,
        limit: number
    ): Promise<{ reviews: IReviewEntity[]; total: number }> {
        const skip = (page - 1) * limit
        const query = { serviceId: serviceId, isDeleted: false }

        const [reviews, total] = await Promise.all([
            this.model.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean<IReviewModel[]>(),
            this.model.countDocuments(query),
        ])

        return {
            reviews: reviews.map((r) => this.toEntity(r)),
            total
        }
    }

    async findByBookingId(bookingId: string): Promise<IReviewEntity | null> {
        const review = await this.model.findOne({ bookingId }).lean<IReviewModel>()
        return review ? this.toEntity(review) : null
    }

    async calculateAverage(
        serviceId: string
    ): Promise<{ avgRating: number; totalRatings: number }> {
        const stats = await this.model.aggregate([
            { $match: { serviceId: serviceId, isDeleted: false } },
            {
                $group: {
                    _id: '$serviceId',
                    avgRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                },
            },
        ])

        if (stats.length > 0) {
            return {
                avgRating: parseFloat(stats[0].avgRating.toFixed(1)), // Round to 1 decimal
                totalRatings: stats[0].totalRatings,
            }
        }

        return { avgRating: 0, totalRatings: 0 }
    }
    async calculateAverageForVendor(
        vendorId: string
    ): Promise<{ avgRating: number; totalRatings: number }> {
        const stats = await this.model.aggregate([
            { $match: { vendorId: vendorId, isDeleted: false } }, // Ensure vendorId matches and not deleted
            {
                $group: {
                    _id: '$vendorId',
                    avgRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                },
            },
        ])

        if (stats.length > 0) {
            return {
                avgRating: parseFloat(stats[0].avgRating.toFixed(1)), // Round to 1 decimal
                totalRatings: stats[0].totalRatings,
            }
        }

        return { avgRating: 0, totalRatings: 0 }
    }
}
