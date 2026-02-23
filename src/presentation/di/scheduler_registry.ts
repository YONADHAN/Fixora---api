import { container } from 'tsyringe'
import { ExpireBookingHoldsUseCase } from '../../application/usecase/booking_hold/expire_booking_holds_usecase'
import { IExpireBookingHoldsUseCase } from '../../domain/useCaseInterfaces/booking_hold/expire_booking_holds_usecase_interface'

export class ShedulerRegistry {
  static registerSheduler(): void {
    container.register<IExpireBookingHoldsUseCase>(
      'IExpireBookingHoldsUseCase',
      {
        useClass: ExpireBookingHoldsUseCase,
      }
    )
  }
}
