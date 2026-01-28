import { inject, injectable } from 'tsyringe'
import crypto from 'crypto'

import { CancelBookingRequestDTO } from '../../../dtos/booking_dto'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'

import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IPaymentRepository } from '../../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import { IWalletRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'
import { IWalletTransactionRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'
import { ICustomerCancelBookingStrategyInterface } from './customer_cancel_booking_strategy.interface'

@injectable()
export class CustomerCancelBookingStrategy implements ICustomerCancelBookingStrategyInterface {
  constructor(
    @inject('ICustomerRepository')
    private _customerRepository: ICustomerRepository,

    @inject('IBookingRepository')
    private _bookingRepository: IBookingRepository,

    @inject('IPaymentRepository')
    private _paymentRepository: IPaymentRepository,

    @inject('IWalletRepository')
    private _walletRepository: IWalletRepository,

    @inject('IWalletTransactionRepository')
    private _walletTransactionRepository: IWalletTransactionRepository,
  ) {}

  async execute(payload: CancelBookingRequestDTO): Promise<void> {
    const { userId, bookingId, reason, role } = payload

    const initialBooking = await this._bookingRepository.findOne({ bookingId })
    if (!initialBooking) {
      throw new CustomError(
        ERROR_MESSAGES.NO_BOOKING_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    const groupBookings =
      await this._bookingRepository.findAllDocsWithoutPagination({
        bookingGroupId: initialBooking.bookingGroupId,
      })

    const bookings = await this._bookingRepository.countDocuments({})

    if (!groupBookings.length) {
      throw new CustomError(
        ERROR_MESSAGES.NO_BOOKING_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    const user = await this._customerRepository.findOne({ userId })
    if (!user || !user._id) {
      throw new CustomError(
        ERROR_MESSAGES.FILE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    if (initialBooking.customerRef !== user._id.toString()) {
      throw new CustomError(
        ERROR_MESSAGES.CONFLICTING_INPUTS,
        HTTP_STATUS.CONFLICT,
      )
    }

    const payment = await this._paymentRepository.findOne({
      bookingGroupId: initialBooking.bookingGroupId,
    })

    if (!payment) {
      throw new CustomError(
        ERROR_MESSAGES.FILE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    const wallet = await this._walletRepository.findOne({
      userRef: initialBooking.customerRef,
    })

    if (!wallet || !wallet._id) {
      throw new CustomError(
        ERROR_MESSAGES.FILE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    let totalRefundAmount = 20
    const refundDetailsPerSlot: { bookingId: string; amount: number }[] = []

    for (const booking of groupBookings) {
      if (booking.serviceStatus === 'cancelled') continue

      const paymentSlot = payment.slots.find(
        (s) => s.bookingId === booking.bookingId,
      )
      if (paymentSlot) {
        const amount = paymentSlot.pricing.advanceAmount
        totalRefundAmount = 20
        refundDetailsPerSlot.push({ bookingId: booking.bookingId, amount })
      }
    }

    if (totalRefundAmount > 0) {
      await this._walletTransactionRepository.save({
        transactionId: `WTXN_${crypto.randomUUID()}`,
        walletRef: wallet._id,
        userRef: initialBooking.customerRef,

        type: 'credit',
        source: 'booking-refund',

        amount: totalRefundAmount,
        currency: payment.advancePayment?.currency || 'inr',

        description: `Refund for cancelled booking group ${initialBooking.bookingGroupId}`,
        paymentRef: payment._id,
      })
    }

    for (const detail of refundDetailsPerSlot) {
      await this._paymentRepository.updateSlotAdvanceRefund(
        payment.paymentId,
        detail.bookingId,
        {
          refundId: `REF_${crypto.randomUUID()}`,
          amount: detail.amount,
          status: 'succeeded',
          initiatedBy: role,
          initiatedByUserId: user._id.toString(),
          createdAt: new Date(),
          failures: [],
        },
      )

      await this._bookingRepository.update(
        { bookingId: detail.bookingId },
        {
          cancelInfo: {
            cancelledByRef: user._id.toString(),
            cancelledByRole: role,
            reason,
            cancelledAt: new Date(),
          },
          serviceStatus: 'cancelled',
        },
      )
    }

    for (const booking of groupBookings) {
      if (booking.serviceStatus !== 'cancelled') {
        await this._bookingRepository.update(
          { bookingId: booking.bookingId },
          {
            cancelInfo: {
              cancelledByRef: user._id.toString(),
              cancelledByRole: role,
              reason,
              cancelledAt: new Date(),
            },
            serviceStatus: 'cancelled',
          },
        )
      }
    }
  }
}
