import { inject, injectable } from 'tsyringe'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { CustomError } from '../../../../domain/utils/custom.error'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { GetBookingResponseMapper } from '../../../mappers/booking/get_bookings_strategy_mapper'
import {
  GetBookingRequestDTO,
  GetBookingResponseDTO,
} from '../../../dtos/booking_dto'
import { IGetBookingForVendorStrategyInterface } from './get_booking_for_vendor_strategy.interface'

type SortQuery = Record<string, 1 | -1>

@injectable()
export class GetBookingForVendorStrategy
  implements IGetBookingForVendorStrategyInterface
{
  constructor(
    @inject('IBookingRepository')
    private readonly _bookingRepository: IBookingRepository,
    @inject('IVendorRepository')
    private readonly _vendorRepository: IVendorRepository
  ) {}
  async strategy(dto: GetBookingRequestDTO): Promise<GetBookingResponseDTO> {
    const { page, limit, search = '', userId, sortOption, filterOption } = dto
    const vendor = await this._vendorRepository.findOne({ userId })
    if (!vendor) {
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
      vendorRef: vendor._id,
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
