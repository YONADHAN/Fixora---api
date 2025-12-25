import { inject, injectable } from 'tsyringe'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { GetBookingResponseMapper } from '../../../mappers/booking/get_bookings_strategy_mapper'
import { IGetBookingForAdminStrategyInterface } from './get_booking_for_admin_strategy.interface'
import {
  GetBookingRequestDTO,
  GetBookingResponseDTO,
} from '../../../dtos/booking_dto'

@injectable()
export class GetBookingForAdminStrategy
  implements IGetBookingForAdminStrategyInterface
{
  constructor(
    @inject('IBookingRepository')
    private readonly _bookingRepository: IBookingRepository
  ) {}
  async strategy(dto: GetBookingRequestDTO): Promise<GetBookingResponseDTO> {
    const { page, limit, search = '' } = dto
    const booking = await this._bookingRepository.findBookingsForUser(
      page,
      limit,
      search,
      {}
    )
    return GetBookingResponseMapper.toDTO(booking)
  }
}
