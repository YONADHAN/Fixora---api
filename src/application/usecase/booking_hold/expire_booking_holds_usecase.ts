import { inject, injectable } from 'tsyringe'
import { IBookingHoldRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_hold_repository.interface'
import { IRedisSlotLockRepository } from '../../../domain/repositoryInterfaces/redis/redis_slot_lock_repository_interface'
import { IExpireBookingHoldsUseCase } from '../../../domain/useCaseInterfaces/booking_hold/expire_booking_holds_usecase_interface'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'

@injectable()
export class ExpireBookingHoldsUseCase implements IExpireBookingHoldsUseCase {
  constructor(
    @inject('IBookingHoldRepository')
    private _bookingHoldRepository: IBookingHoldRepository,

    @inject('IRedisSlotLockRepository')
    private _redisSlotLockRepository: IRedisSlotLockRepository,

    @inject('ICustomerRepository')
    private _customerRepository: ICustomerRepository,
  ) {}

  async execute(): Promise<void> {
    const now = new Date()

    const expiredHolds =
      await this._bookingHoldRepository.findExpiredActiveHolds(now)

    for (const hold of expiredHolds) {
      await this._bookingHoldRepository.markHoldAsExpired(hold.holdId)
      const customer = await this._customerRepository.findOne({_id: hold.customerRef})
      if(!customer){
        throw new CustomError(ERROR_MESSAGES.USERS_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
      }
      if(!customer.userId){
        throw new CustomError(ERROR_MESSAGES.USERS_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
      }
      for (const slot of hold.slots) {
        
        await this._redisSlotLockRepository.releaseSlot(
          hold.serviceRef,
          slot.date,
          slot.start,
          customer.userId
        )
      }
    }
  }
}
