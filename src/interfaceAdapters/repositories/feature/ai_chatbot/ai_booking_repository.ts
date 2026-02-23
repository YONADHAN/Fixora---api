import { inject, injectable } from 'tsyringe'
import { IBookingEntity } from '../../../../domain/models/booking_entity'
import { IAiBookingRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_booking_repository.interface'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { AIRole } from '../../../../shared/types/ai/ai.types'
import { FilterQuery } from 'mongoose'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'

@injectable()
export class AiBookingRepository implements IAiBookingRepository {
  constructor(
    @inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,

    @inject('IVendorRepository')
    private readonly vendorRepository: IVendorRepository,

    @inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async getBookingsForAI(params: {
    role: AIRole
    userId: string
    status?: IBookingEntity['serviceStatus']
    paymentStatus?: IBookingEntity['paymentStatus']
    search?: string
    limit?: number
  }): Promise<
    Array<{
      bookingId: string
      serviceName: string
      date: string
      status: IBookingEntity['serviceStatus']
      paymentStatus: IBookingEntity['paymentStatus']
    }>
  > {
    const filters: FilterQuery<IBookingEntity> = {}

    if (params.role === 'customer') {
      const customer = await this.customerRepository.findOne({
        userId: params.userId,
      })

      if (!customer?._id) {
        throw new CustomError(
          ERROR_MESSAGES.USERS_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        )
      }

      filters.customerRef = customer._id
    }

    if (params.role === 'vendor') {
      const vendor = await this.vendorRepository.findOne({
        userId: params.userId,
      })

      if (!vendor?._id) {
        throw new CustomError(
          ERROR_MESSAGES.USERS_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        )
      }

      filters.vendorRef = vendor._id
    }

    if (params.status) {
      filters.serviceStatus = params.status
    }

    if (params.paymentStatus) {
      filters.paymentStatus = params.paymentStatus
    }

    const result = await this.bookingRepository.findBookingsForUser(
      1,
      params.limit ?? 10,
      params.search ?? '',
      filters,
    )

    return result.data.map((b) => ({
      bookingId: b.bookingId,
      serviceName: b.serviceName ?? 'Unknown Service',
      date: b.date,
      status: b.serviceStatus,
      paymentStatus: b.paymentStatus,
    }))
  }
}
