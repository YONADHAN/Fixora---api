import { inject, injectable } from 'tsyringe'
import Stripe from 'stripe'

import { IBookingHoldRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_hold_repository.interface'
import { IRedisSlotLockRepository } from '../../../domain/repositoryInterfaces/redis/redis_slot_lock_repository_interface'
import { IStripePaymentFailedUseCase } from '../../../domain/useCaseInterfaces/booking_hold/stripe_payment_failed_usecase_interface'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'

@injectable()
export class StripePaymentFailedUseCase implements IStripePaymentFailedUseCase {
  constructor(
    @inject('IBookingHoldRepository')
    private _bookingHoldRepository: IBookingHoldRepository,

    @inject('IRedisSlotLockRepository')
    private _redisSlotLockRepository: IRedisSlotLockRepository,

    @inject('ICustomerRepository')
    private _customerRepository: ICustomerRepository,
  ) {}

  async execute(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const hold = await this._bookingHoldRepository.findByStripePaymentIntentId(
      paymentIntent.id
    )

    if (!hold || hold.status !== 'active') {
      return
    }

    await this._bookingHoldRepository.markHoldAsFailed(hold.holdId)
    const customer = await this._customerRepository.findOne({
      _id: hold.customerRef,
    })
    if(!customer){
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    if(!customer.userId){
       throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    for (const slot of hold.slots) {
      await this._redisSlotLockRepository.releaseSlot(
        hold.serviceRef,
        slot.date,
        slot.start,
        customer?.userId,
      )
    }
  }
}
