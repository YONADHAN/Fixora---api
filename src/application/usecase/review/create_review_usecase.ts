import { inject, injectable } from 'tsyringe'
import { v4 as uuidv4 } from 'uuid'
import {
    CreateReviewDto,
    ICreateReviewUseCase,
} from '../../../domain/useCaseInterfaces/review/create_review_usecase.interface'
import { IReviewEntity } from '../../../domain/models/review_entity'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IReviewRepository } from '../../../domain/repositoryInterfaces/feature/review/review_repository.interface'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'

@injectable()
export class CreateReviewUseCase implements ICreateReviewUseCase {
    constructor(
        @inject('IReviewRepository') private reviewRepository: IReviewRepository,
        @inject('IBookingRepository') private bookingRepository: IBookingRepository,
        @inject('IServiceRepository') private serviceRepository: IServiceRepository,
        @inject('IVendorRepository') private vendorRepository: IVendorRepository
    ) { }

    async execute(data: CreateReviewDto): Promise<IReviewEntity> {
        const { bookingId, serviceId, rating, comment, customerId } = data


        const booking = await this.bookingRepository.getBookingById(bookingId)
        if (!booking) {
            throw new CustomError('Booking not found', HTTP_STATUS.NOT_FOUND)
        }


        const bookingCustomerId = typeof booking.customerRef === 'object'
            ? (booking.customerRef as any).userId
            : null
        if (booking.serviceStatus !== 'completed') {
            throw new CustomError('Booking must be completed to review', HTTP_STATUS.BAD_REQUEST)
        }


        const existingReview = await this.reviewRepository.findByBookingId(bookingId)
        if (existingReview) {
            throw new CustomError('You have already reviewed this booking', HTTP_STATUS.CONFLICT)
        }


        const vendor = await this.vendorRepository.findOne({ _id: booking.vendorRef as unknown as string })
        if (!vendor) {
            throw new CustomError('Vendor not found', HTTP_STATUS.NOT_FOUND)
        }


        const review = await this.reviewRepository.create({
            reviewId: uuidv4(),
            bookingId: booking.bookingId,
            serviceId: serviceId,
            customerId: customerId,
            vendorId: vendor.userId!,
            rating,
            comment,
            createdAt: new Date(),
            isDeleted: false,
        })


        const serviceStats = await this.reviewRepository.calculateAverage(serviceId)
        await this.serviceRepository.update(
            { _id: serviceId },
            {
                avgRating: serviceStats.avgRating,
                totalRatings: serviceStats.totalRatings,
            }
        )



        return review
    }
}
