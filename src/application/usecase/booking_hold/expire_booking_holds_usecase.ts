import { inject, injectable } from 'tsyringe'
import { IBookingHoldRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_hold_repository.interface'
import { IRedisSlotLockRepository } from '../../../domain/repositoryInterfaces/redis/redis_slot_lock_repository_interface'
import { IExpireBookingHoldsUseCase } from '../../../domain/useCaseInterfaces/booking_hold/expire_booking_holds_usecase_interface'

@injectable()
export class ExpireBookingHoldsUseCase implements IExpireBookingHoldsUseCase {
  constructor(
    @inject('IBookingHoldRepository')
    private _bookingHoldRepository: IBookingHoldRepository,

    @inject('IRedisSlotLockRepository')
    private _redisSlotLockRepository: IRedisSlotLockRepository
  ) {}

  async execute(): Promise<void> {
    const now = new Date()

    const expiredHolds =
      await this._bookingHoldRepository.findExpiredActiveHolds(now)

    for (const hold of expiredHolds) {
      await this._bookingHoldRepository.markHoldAsExpired(hold.holdId)

      for (const slot of hold.slots) {
        await this._redisSlotLockRepository.releaseSlot(
          hold.serviceRef,
          slot.date,
          slot.start
        )
      }
    }
  }
}
