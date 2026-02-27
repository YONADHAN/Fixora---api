import { inject, injectable } from 'tsyringe'
import {
  GetBookingRequestDTO,
  GetBookingResponseDTO,
} from '../../dtos/booking_dto'

import { IGetBookingsFactory } from '../../factories/booking/get_booking_factory.interface'
import { IGetBookingsUseCase } from '../../../domain/useCaseInterfaces/booking/get_bookings_usecase_interface'

@injectable()
export class GetBookingsUseCase implements IGetBookingsUseCase {
  constructor(
    @inject('IGetBookingsFactory')
    private _getBookingsFactory: IGetBookingsFactory
  ) {}

  async execute(dto: GetBookingRequestDTO): Promise<GetBookingResponseDTO> {
    const response = await this._getBookingsFactory.getStrategy(dto)
    return response
  }
}
