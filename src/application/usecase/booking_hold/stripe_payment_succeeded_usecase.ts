import { inject, injectable } from 'tsyringe'
import Stripe from 'stripe'
import crypto from 'crypto'

import { IBookingHoldRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_hold_repository.interface'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IRedisSlotLockRepository } from '../../../domain/repositoryInterfaces/redis/redis_slot_lock_repository_interface'
import { IStripePaymentSucceedUseCase } from '../../../domain/useCaseInterfaces/booking_hold/stripe_payment_succeeded_usecase_interface'
import { IWalletTransactionRepository } from '../../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'
import { IPaymentRepository } from '../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import { IWalletRepository } from '../../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'

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
    private _redisSlotLockRepository: IRedisSlotLockRepository,

    @inject('IPaymentRepository')
    private _paymentRepository: IPaymentRepository,

    @inject('IWalletTransactionRepository')
    private _walletTransactionRepository: IWalletTransactionRepository,

    @inject('IWalletRepository')
    private _walletRepository: IWalletRepository
  ) {}

  async execute(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const hold =
      (await this._bookingHoldRepository.findByStripePaymentIntentId(
        paymentIntent.id
      )) ??
      (await this._bookingHoldRepository.findOne({
        holdId: paymentIntent.metadata?.holdId,
      }))

    if (!hold || hold.status !== 'active') return

    const createdBookings = []

    for (const slot of hold.slots) {
      const booking = await this._bookingRepository.save({
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

      createdBookings.push({
        bookingId: booking.bookingId,
        pricing: {
          totalPrice: slot.pricePerSlot,
          advanceAmount: slot.advancePerSlot,
          remainingAmount: slot.pricePerSlot - slot.advancePerSlot,
        },
      })
    }

    //creating payment
    const payment = await this._paymentRepository.save({
      paymentId: `PAY_${crypto.randomUUID()}`,
      bookingGroupId: hold.holdId,

      serviceRef: hold.serviceRef,
      vendorRef: hold.vendorRef,
      customerRef: hold.customerRef,

      advancePayment: {
        stripePaymentIntentId: paymentIntent.id,
        amount: hold.pricing.advanceAmount,
        currency: 'INR',
        status: 'paid',
        paidAt: new Date(),
        failures: [],
      },

      slots: createdBookings.map((b) => ({
        bookingId: b.bookingId,
        pricing: b.pricing,
        status: 'advance-paid',
      })),

      status: 'advance-paid',
    })

    let wallet = await this._walletRepository.findOne({
      userRef: hold.customerRef,
    })

    if (!wallet) {
      wallet = await this._walletRepository.save({
        walletId: `WAL_${crypto.randomUUID()}`,
        userRef: hold.customerRef,
        userType: 'customer',
        currency: 'INR',
        isActive: true,
        balance: 0,
      })
    }

    await this._walletTransactionRepository.save({
      transactionId: `WTXN_${crypto.randomUUID()}`,
      walletRef: wallet._id,
      userRef: hold.customerRef,
      type: 'debit',
      source: 'service-booking',
      amount: hold.pricing.advanceAmount,
      currency: 'INR',
      description: `Advance payment for ${hold.holdId}`,
      bookingHoldRef: hold._id,
      paymentRef: payment._id,
      stripePaymentIntentId: paymentIntent.id,
    })

    await this._bookingHoldRepository.markHoldAsCompleted(hold.holdId)

    for (const slot of hold.slots) {
      await this._redisSlotLockRepository.releaseSlot(
        hold.serviceRef,
        slot.date,
        slot.start
      )
    }
  }
}
