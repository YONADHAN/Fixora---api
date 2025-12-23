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

@injectable()
export class GetBookingForCustomerStrategy
  implements IGetBookingForCustomerStrategyInterface
{
  constructor(
    @inject('IBookingRepository')
    private readonly _bookingRepository: IBookingRepository,
    @inject('ICustomerRepository')
    private readonly _customerRepository: ICustomerRepository
  ) {}
  async strategy(dto: GetBookingRequestDTO): Promise<GetBookingResponseDTO> {
    const { page, limit, search = '', userId, role } = dto
    const customer = await this._customerRepository.findOne({ userId })
    if (!customer) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }
    const booking =
      await this._bookingRepository.findAllDocumentsWithFilteration(
        page,
        limit,
        search,
        { customerRef: customer._id }
      )
    return GetBookingResponseMapper.toDTO(booking)
  }
}
