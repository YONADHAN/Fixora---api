import { inject, injectable } from 'tsyringe'
import Stripe from 'stripe'

import { IBookingHoldRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_hold_repository.interface'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IRedisSlotLockRepository } from '../../../domain/repositoryInterfaces/redis/redis_slot_lock_repository_interface'
import { IStripePaymentSucceedUseCase } from '../../../domain/useCaseInterfaces/booking_hold/stripe_payment_succeeded_usecase_interface'

@injectable()
export class StripePaymentSucceededUseCase
  implements IStripePaymentSucceedUseCase
{
  constructor(
    @inject('IBookingHoldRepository')
    private _bookingHoldRepository: IBookingHoldRepository,

    @inject('IBookingRepository')
    private _bookingRepository: IBookingRepository,

    @inject('IRedisSlotLockRepository')
    private _redisSlotLockRepository: IRedisSlotLockRepository
  ) {}

  async execute(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log('entered the success usecase')
    console.log('paymentIntent after success: ', paymentIntent.id)
    const hold = await this._bookingHoldRepository.findByStripePaymentIntentId(
      paymentIntent.id
    )

    if (!hold || hold.status !== 'active') {
      return
    }

    console.log('creating confirmed bookings')
    //  Create confirmed bookings
    for (const slot of hold.slots) {
      await this._bookingRepository.save({
        bookingId: `BOOK_${crypto.randomUUID()}`,
        bookingGroupId: hold.holdId,

        serviceRef: hold.serviceRef,
        vendorRef: hold.vendorRef,
        customerRef: hold.customerRef,

        date: slot.date,
        slotStart: new Date(`${slot.date}T${slot.start}`),
        slotEnd: new Date(`${slot.date}T${slot.end}`),

        paymentStatus: 'advance-paid',
        serviceStatus: 'scheduled',
      })
    }

    //  Mark hold completed
    await this._bookingHoldRepository.markHoldAsCompleted(hold.holdId)

    //  Release Redis locks
    for (const slot of hold.slots) {
      await this._redisSlotLockRepository.releaseSlot(
        hold.serviceRef,
        slot.date,
        slot.start
      )
    }
  }
}
