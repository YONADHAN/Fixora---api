import { inject, injectable } from 'tsyringe'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { CancelBookingRequestDTO } from '../../dtos/booking_dto'
import { ICancelBookingFactory } from '../../factories/booking/cancel_booking_factory.interface'
import { ICancelBookingUseCase } from '../../../domain/useCaseInterfaces/booking/cancel_booking_usecase_interface'

@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase {
  constructor(
    @inject('ICancelBookingFactory')
    private readonly _cancelBookingFactory: ICancelBookingFactory
  ) {}
  async execute(payload: CancelBookingRequestDTO): Promise<void> {
    await this._cancelBookingFactory.getStrategy(payload)
  }
}
