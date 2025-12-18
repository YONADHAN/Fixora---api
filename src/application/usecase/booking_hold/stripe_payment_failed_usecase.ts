import { inject, injectable } from 'tsyringe'
import Stripe from 'stripe'

import { IBookingHoldRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_hold_repository.interface'
import { IRedisSlotLockRepository } from '../../../domain/repositoryInterfaces/redis/redis_slot_lock_repository_interface'
import { IStripePaymentFailedUseCase } from '../../../domain/useCaseInterfaces/booking_hold/stripe_payment_failed_usecase_interface'

@injectable()
export class StripePaymentFailedUseCase implements IStripePaymentFailedUseCase {
  constructor(
    @inject('IBookingHoldRepository')
    private _bookingHoldRepository: IBookingHoldRepository,

    @inject('IRedisSlotLockRepository')
    private _redisSlotLockRepository: IRedisSlotLockRepository
  ) {}

  async execute(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const hold = await this._bookingHoldRepository.findByStripePaymentIntentId(
      paymentIntent.id
    )

    if (!hold || hold.status !== 'active') {
      // Already handled / invalid
      return
    }

    await this._bookingHoldRepository.markHoldAsFailed(hold.holdId)

    for (const slot of hold.slots) {
      await this._redisSlotLockRepository.releaseSlot(
        hold.serviceRef,
        slot.date,
        slot.start
      )
    }
  }
}
