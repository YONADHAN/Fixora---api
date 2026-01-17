import { inject, injectable } from 'tsyringe'
import { ICheckReviewEligibilityUseCase } from '../../../domain/useCaseInterfaces/review/check_review_eligibility_usecase.interface'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IReviewRepository } from '../../../domain/repositoryInterfaces/feature/review/review_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'

import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'

@injectable()
export class CheckReviewEligibilityUseCase
  implements ICheckReviewEligibilityUseCase {
  constructor(
    @inject('IBookingRepository') private bookingRepository: IBookingRepository,
    @inject('IReviewRepository') private reviewRepository: IReviewRepository,
    @inject('ICustomerRepository')
    private customerRepository: ICustomerRepository,
    @inject('IServiceRepository') private serviceRepository: IServiceRepository
  ) { }

  async execute(
    customerId: string,
    serviceId: string
  ): Promise<{ canReview: boolean; message?: string; bookingId?: string }> {


    const customer = await this.customerRepository.findOne({
      userId: customerId,
    })

    if (!customer) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    const service = await this.serviceRepository.findOne({ serviceId })

    if (!service) {
      throw new CustomError(
        ERROR_MESSAGES.SERVICES_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    if (!customer._id || !service._id) {
      throw new CustomError(
        'Invalid customer or service data',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    }

    const bookings = await this.bookingRepository.findCompletedBookingsForReview(
      customer._id.toString(),
      service._id.toString()
    )

    if (!bookings || bookings.length === 0) {
      return {
        canReview: false,
        message: 'Only customers who completed this service can review.',
      }
    }


    for (const booking of bookings) {
      const existingReview = await this.reviewRepository.findByBookingId(
        booking.bookingId
      )
      if (!existingReview) {
        return { canReview: true, bookingId: booking.bookingId }
      }
    }

    return {
      canReview: false,
      message:
        'You have already reviewed all your completed bookings for this service.',
    }
  }
}
