import { inject, injectable } from 'tsyringe'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'

import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IServiceRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import {
  GetBookingDetailsForCustomerStrategyResponseDTO,
  GetBookingDetailsRequestDTO,
} from '../../../dtos/booking_dto'
import { IGetBookingDetailsForCustomerStrategy } from './get_booking_details_for_customer_strategy.interface'
import { GetBookingDetailsForCustomerResponseMapper } from '../../../mappers/booking/get_booking_details_strategy_mapper'
@injectable()
export class GetBookingDetailsForCustomerStrategy
  implements IGetBookingDetailsForCustomerStrategy
{
  constructor(
    @inject('IBookingRepository')
    private readonly _bookingRepository: IBookingRepository,

    @inject('IVendorRepository')
    private readonly _vendorRepository: IVendorRepository,

    @inject('IServiceRepository')
    private readonly _serviceRepository: IServiceRepository,

    @inject('ICustomerRepository')
    private readonly _customerRepository: ICustomerRepository
  ) {}

  async execute(
    payload: GetBookingDetailsRequestDTO
  ): Promise<GetBookingDetailsForCustomerStrategyResponseDTO> {
    const { bookingId, userId } = payload

    const booking = await this._bookingRepository.findOne({ bookingId })
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.NO_BOOKING_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    const customer = await this._customerRepository.findOne({ userId })
    if (!customer || !customer._id) {
      throw new CustomError(
        ERROR_MESSAGES.USERS_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    if (booking.customerRef !== customer._id.toString()) {
      throw new CustomError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.FORBIDDEN
      )
    }

    const vendor = await this._vendorRepository.findOne({
      _id: booking.vendorRef,
    })

    const service = await this._serviceRepository.findOne({
      _id: booking.serviceRef,
    })

    return GetBookingDetailsForCustomerResponseMapper.toDTO(
      booking,
      vendor,
      service
    )
  }
}
