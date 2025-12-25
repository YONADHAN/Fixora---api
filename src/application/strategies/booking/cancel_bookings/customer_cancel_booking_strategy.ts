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
export class CustomerCancelBookingStrategy
  implements ICustomerCancelBookingStrategyInterface
{
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
    private _walletTransactionRepository: IWalletTransactionRepository
  ) {}

  async execute(payload: CancelBookingRequestDTO): Promise<void> {
    const { userId, bookingId, reason, role } = payload

    const booking = await this._bookingRepository.findOne({ bookingId })
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.NO_BOOKING_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    const user = await this._customerRepository.findOne({ userId })
    if (!user || !user._id) {
      throw new CustomError(
        ERROR_MESSAGES.FILE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    if (booking.customerRef !== user._id.toString()) {
      throw new CustomError(
        ERROR_MESSAGES.CONFLICTING_INPUTS,
        HTTP_STATUS.CONFLICT
      )
    }

    const payment = await this._paymentRepository.findOne({
      bookingGroupId: booking.bookingGroupId,
    })

    if (!payment) {
      throw new CustomError(
        ERROR_MESSAGES.FILE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    const wallet = await this._walletRepository.findOne({
      userRef: booking.customerRef,
    })

    if (!wallet || !wallet._id) {
      throw new CustomError(
        ERROR_MESSAGES.FILE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    await this._walletTransactionRepository.save({
      transactionId: `WTXN_${crypto.randomUUID()}`,
      walletRef: wallet._id,
      userRef: booking.customerRef,

      type: 'credit',
      source: 'booking-refund',

      amount: payment.advancePayment.amount,
      currency: payment.advancePayment.currency,

      description: `Refund for cancelled booking ${booking.bookingId}`,
      paymentRef: payment._id,
    })

    await this._paymentRepository.updateSlotAdvanceRefund(
      payment.paymentId,
      booking.bookingId,
      {
        refundId: `REF_${crypto.randomUUID()}`,
        amount: payment.advancePayment.amount,
        status: 'succeeded',
        initiatedBy: role,
        initiatedByUserId: user._id.toString(),
        createdAt: new Date(),
        failures: [],
      }
    )

    await this._bookingRepository.update(
      { bookingId },
      {
        cancelInfo: {
          cancelledByRef: user._id.toString(),
          cancelledByRole: role,
          reason,
          cancelledAt: new Date(),
        },
        serviceStatus: 'cancelled',
      }
    )
  }
}
