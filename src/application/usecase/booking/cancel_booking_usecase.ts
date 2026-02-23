import { inject, injectable } from 'tsyringe'
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
