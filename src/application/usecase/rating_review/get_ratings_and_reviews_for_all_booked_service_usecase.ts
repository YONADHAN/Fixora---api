import { inject, injectable } from 'tsyringe'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IRatingsReviewRepository } from '../../../domain/repositoryInterfaces/feature/ratings_review/ratings_review_repository.interface'

import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'
import {
  GetRatingsAndReviewsForBookedServicesRequestDTO,
  GetRatingsAndReviewsForBookedServicesResponseDTO,
} from '../../dtos/rating_review_dto'
import { IGetRatingsAndReviewsForAllBookedServicesUseCase } from '../../../domain/useCaseInterfaces/rating_review/get_ratings_and_reviews_for_all_booked_service_usecase.interface'

@injectable()
export class GetRatingsAndReviewsForAllBookedServicesUseCase implements IGetRatingsAndReviewsForAllBookedServicesUseCase {
  constructor(
    @inject('IBookingRepository')
    private bookingRepo: IBookingRepository,

    @inject('IRatingsReviewRepository')
    private ratingsRepo: IRatingsReviewRepository,

    @inject('ICustomerRepository')
    private _customerRepo: ICustomerRepository,
  ) {}

  async execute(
    input: GetRatingsAndReviewsForBookedServicesRequestDTO,
  ): Promise<GetRatingsAndReviewsForBookedServicesResponseDTO> {
    const { customerId, page, limit, search = '', sortBy, sortOrder } = input
    const customer = await this._customerRepo.findOne({ userId: customerId })
    if (!customer?._id) {
      throw new CustomError('customer not found', HTTP_STATUS.BAD_REQUEST)
    }
    const customerRef = customer._id.toString()
    const bookingResult =
      await this.bookingRepo.getAllServicesWhichCompletedBookings(
        customerRef,
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      )

    if (!bookingResult) {
      throw new CustomError('No bookings found', HTTP_STATUS.NOT_FOUND)
    }

    const serviceRefs = bookingResult.data.map((b) => b.serviceRef)

    const reviews = await this.ratingsRepo.findByCustomerAndServices(
      customerRef,
      serviceRefs,
    )

    const reviewMap = new Map(reviews.map((r) => [r.serviceRef, r]))

    return {
      data: bookingResult.data.map((b) => {
        const review = reviewMap.get(b.serviceRef)
        return {
          serviceRef: b.serviceRef,
          serviceId: b.serviceId ?? '',
          serviceName: b.serviceName ?? '',
          mainImage: b.mainImage ?? '',
          isReviewed: !!review,
          rating: review?.rating,
          review: review?.review,
          ratingReviewId: review?.ratingsReviewId,
        }
      }),
      currentPage: bookingResult.currentPage,
      totalPages: bookingResult.totalPages,
    }
  }
}
