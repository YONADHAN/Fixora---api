import { inject, injectable } from 'tsyringe'
import {
  GetBookingDetailsForCustomerStrategyResponseDTO,
  GetBookingDetailsForVendorStrategyResponseDTO,
  GetBookingDetailsRequestDTO,
} from '../../dtos/booking_dto'
import { IGetBookingDetailsFactory } from '../../factories/booking/get_booking_details_factory.interface'
import { IGetBookingDetailsUseCase } from '../../../domain/useCaseInterfaces/booking/get_booking_details_usecase_interface'

@injectable()
export class GetBookingDetailsUseCase implements IGetBookingDetailsUseCase {
  constructor(
    @inject('IGetBookingDetailsFactory')
    private readonly _getBookingDetailsFactory: IGetBookingDetailsFactory
  ) {}
  async execute(
    payload: GetBookingDetailsRequestDTO
  ): Promise<
    | GetBookingDetailsForVendorStrategyResponseDTO
    | GetBookingDetailsForCustomerStrategyResponseDTO
  > {
    return await this._getBookingDetailsFactory.getStrategy(payload)
  }
}
