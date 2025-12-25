import { inject, injectable } from 'tsyringe'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'

import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IServiceRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import {
  GetBookingDetailsForVendorStrategyResponseDTO,
  GetBookingDetailsRequestDTO,
} from '../../../dtos/booking_dto'
import { GetBookingDetailsForVendorResponseMapper } from '../../../mappers/booking/get_booking_details_strategy_mapper'
import { IGetBookingDetailsForVendorStrategy } from './get_booking_details_for_vendor_strategy.interface'
@injectable()
export class GetBookingDetailsForVendorStrategy
  implements IGetBookingDetailsForVendorStrategy
{
  constructor(
    @inject('IVendorRepository')
    private readonly _vendorRepository: IVendorRepository,

    @inject('IBookingRepository')
    private readonly _bookingRepository: IBookingRepository,

    @inject('IServiceRepository')
    private readonly _serviceRepository: IServiceRepository,

    @inject('ICustomerRepository')
    private readonly _customerRepository: ICustomerRepository
  ) {}

  async execute(
    payload: GetBookingDetailsRequestDTO
  ): Promise<GetBookingDetailsForVendorStrategyResponseDTO> {
    const { bookingId, userId } = payload

    const vendor = await this._vendorRepository.findOne({ userId })
    if (!vendor) {
      throw new CustomError(
        ERROR_MESSAGES.USERS_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    const booking = await this._bookingRepository.findOne({ bookingId })
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.NO_BOOKING_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    if (booking.vendorRef !== vendor._id?.toString()) {
      throw new CustomError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.FORBIDDEN
      )
    }

    const service = await this._serviceRepository.findOne({
      _id: booking.serviceRef,
    })

    if (!service) {
      throw new CustomError(
        ERROR_MESSAGES.SERVICES_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    const customer = await this._customerRepository.findOne({
      _id: booking.customerRef,
    })

    if (!customer) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    return GetBookingDetailsForVendorResponseMapper.toDTO(
      booking,
      service,
      customer
    )
  }
}
