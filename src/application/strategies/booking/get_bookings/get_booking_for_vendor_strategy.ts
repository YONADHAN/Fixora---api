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
    const { page, limit, search = '', userId } = dto
    const vendor = await this._vendorRepository.findOne({ userId })
    if (!vendor) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }
    const booking = await this._bookingRepository.findBookingsForUser(
      page,
      limit,
      search,
      { vendorRef: vendor._id }
    )
    return GetBookingResponseMapper.toDTO(booking)
  }
}
