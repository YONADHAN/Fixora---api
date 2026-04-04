import { inject, injectable } from 'tsyringe'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { GetBookingResponseMapper } from '../../../mappers/booking/get_bookings_strategy_mapper'
import {
  GetBookingRequestDTO,
  GetBookingResponseDTO,
} from '../../../dtos/booking_dto'
import { IGetBookingForCustomerStrategyInterface } from './get_booking_for_customer_strategy.interface'
type SortQuery = Record<string, 1 | -1>
@injectable()
export class GetBookingForCustomerStrategy
  implements IGetBookingForCustomerStrategyInterface {
  constructor(
    @inject('IBookingRepository')
    private readonly _bookingRepository: IBookingRepository,
    @inject('ICustomerRepository')
    private readonly _customerRepository: ICustomerRepository
  ) { }
  async strategy(dto: GetBookingRequestDTO): Promise<GetBookingResponseDTO> {
    const { page, limit, search = '', userId, sortOption, filterOption } = dto
    const customer = await this._customerRepository.findOne({ userId })
    if (!customer) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }
    let sortIn: SortQuery = {}
    let filterIn = {}
    let sortAfterLookup = false

    switch (sortOption) {
      case 'latest':
        sortIn = { createdAt: -1 }
        break

      case 'oldest':
        sortIn = { createdAt: 1 }
        break

      case 'service_name_asc':
        sortIn = { serviceName: 1 }
        sortAfterLookup = true
        break

      case 'service_name_desc':
        sortIn = { serviceName: -1 }
        sortAfterLookup = true
        break

      default:
        sortIn = { createdAt: -1 }
    }

    switch (filterOption) {
      case 'active':
        filterIn = {
          serviceStatus: { $in: ['scheduled', 'in-progress'] },
        }
        break

      case 'cancelled':
        filterIn = { serviceStatus: 'cancelled' }
        break

      case 'fully_paid':
        filterIn = { paymentStatus: 'fully-paid' }
        break

      case 'adv_paid':
        filterIn = { paymentStatus: 'advance-paid' }
        break

      case 'refunded':
        filterIn = { paymentStatus: 'refunded' }
        break

      default:
        filterIn = {}
    }

    const finalFilter = {
      customerRef: customer._id,
      ...filterIn,
    }

    const booking = await this._bookingRepository.findBookingsForUser(
      page,
      limit,
      search,
      finalFilter,
      sortIn,
      sortAfterLookup
    )
    return GetBookingResponseMapper.toDTO(booking)
  }
}
