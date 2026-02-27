// import { inject, injectable } from 'tsyringe'
// import crypto from 'crypto'

// import { CancelBookingRequestDTO } from '../../../dtos/booking_dto'
// import { CustomError } from '../../../../domain/utils/custom.error'
// import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'

// import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
// import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
// import { IPaymentRepository } from '../../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
// import { IWalletRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'
// import { IWalletTransactionRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'
// import { ICustomerCancelBookingStrategyInterface } from './customer_cancel_booking_strategy.interface'

// @injectable()
// export class CustomerCancelBookingStrategy implements ICustomerCancelBookingStrategyInterface {
//   constructor(
//     @inject('ICustomerRepository')
//     private _customerRepository: ICustomerRepository,

//     @inject('IBookingRepository')
//     private _bookingRepository: IBookingRepository,

//     @inject('IPaymentRepository')
//     private _paymentRepository: IPaymentRepository,

//     @inject('IWalletRepository')
//     private _walletRepository: IWalletRepository,

//     @inject('IWalletTransactionRepository')
//     private _walletTransactionRepository: IWalletTransactionRepository,
//   ) {}

//   async execute(payload: CancelBookingRequestDTO): Promise<void> {
//     const { userId, bookingId, reason, role } = payload

//     const initialBooking = await this._bookingRepository.findOne({ bookingId })
//     if (!initialBooking) {
//       throw new CustomError(
//         ERROR_MESSAGES.NO_BOOKING_FOUND,
//         HTTP_STATUS.NOT_FOUND,
//       )
//     }

//     const groupBookings =
//       await this._bookingRepository.findAllDocsWithoutPagination({
//         bookingGroupId: initialBooking.bookingGroupId,
//       })

//     if (!groupBookings.length) {
//       throw new CustomError(
//         ERROR_MESSAGES.NO_BOOKING_FOUND,
//         HTTP_STATUS.NOT_FOUND,
//       )
//     }

//     const user = await this._customerRepository.findOne({ userId })
//     if (!user || !user._id) {
//       throw new CustomError(
//         ERROR_MESSAGES.FILE_NOT_FOUND,
//         HTTP_STATUS.NOT_FOUND,
//       )
//     }

//     if (initialBooking.customerRef !== user._id.toString()) {
//       throw new CustomError(
//         ERROR_MESSAGES.CONFLICTING_INPUTS,
//         HTTP_STATUS.CONFLICT,
//       )
//     }

//     const payment = await this._paymentRepository.findOne({
//       bookingGroupId: initialBooking.bookingGroupId,
//     })

//     if (!payment) {
//       throw new CustomError(
//         ERROR_MESSAGES.FILE_NOT_FOUND,
//         HTTP_STATUS.NOT_FOUND,
//       )
//     }

//     const wallet = await this._walletRepository.findOne({
//       userRef: initialBooking.customerRef,
//     })

//     if (!wallet || !wallet._id) {
//       throw new CustomError(
//         ERROR_MESSAGES.FILE_NOT_FOUND,
//         HTTP_STATUS.NOT_FOUND,
//       )
//     }

//     const refundDetailsPerSlot: { bookingId: string; amount: number }[] = []

//     for (const booking of groupBookings) {
//       if (booking.serviceStatus === 'cancelled') continue

//       const paymentSlot = payment.slots.find(
//         (s) => s.bookingId === booking.bookingId,
//       )
//       if (paymentSlot) {
//         const amount = paymentSlot.pricing.advanceAmount
//         totalRefundAmount = 20
//         refundDetailsPerSlot.push({ bookingId: booking.bookingId, amount })
//       }
//     }

//     if (totalRefundAmount > 0) {
//       await this._walletTransactionRepository.save({
//         transactionId: `WTXN_${crypto.randomUUID()}`,
//         walletRef: wallet._id,
//         userRef: initialBooking.customerRef,

//         type: 'credit',
//         source: 'booking-refund',

//         amount: totalRefundAmount,
//         currency: payment.advancePayment?.currency || 'inr',

//         description: `Refund for cancelled booking group ${initialBooking.bookingGroupId}`,
//         paymentRef: payment._id,
//       })
//     }

//     for (const detail of refundDetailsPerSlot) {
//       await this._paymentRepository.updateSlotAdvanceRefund(
//         payment.paymentId,
//         detail.bookingId,
//         {
//           refundId: `REF_${crypto.randomUUID()}`,
//           amount: detail.amount,
//           status: 'succeeded',
//           initiatedBy: role,
//           initiatedByUserId: user._id.toString(),
//           createdAt: new Date(),
//           failures: [],
//         },
//       )

//       await this._bookingRepository.update(
//         { bookingId: detail.bookingId },
//         {
//           cancelInfo: {
//             cancelledByRef: user._id.toString(),
//             cancelledByRole: role,
//             reason,
//             cancelledAt: new Date(),
//           },
//           serviceStatus: 'cancelled',
//         },
//       )
//     }

// for (const booking of groupBookings) {
//   if (booking.serviceStatus !== 'cancelled') {
//     await this._bookingRepository.update(
//       { bookingId: booking.bookingId },
//       {
//         cancelInfo: {
//           cancelledByRef: user._id.toString(),
//           cancelledByRole: role,
//           reason,
//           cancelledAt: new Date(),
//         },
//         serviceStatus: 'cancelled',
//       },
//     )
//   }
// }
//   }
// }



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
import { IAdminRepository } from '../../../../domain/repositoryInterfaces/users/admin_repository.interface'

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

    @inject('IAdminRepository')
    private _adminRepository: IAdminRepository,
  ) { }

  async execute(payload: CancelBookingRequestDTO): Promise<void> {
    const { userId, bookingId, reason, role } = payload

    const initialBooking = await this._bookingRepository.findOne({ bookingId })
    if (!initialBooking) {
      throw new CustomError(
        ERROR_MESSAGES.NO_BOOKING_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    const CurrentSlotBookingsGroup =
      await this._bookingRepository.findAllDocsWithoutPagination({
        bookingGroupId: initialBooking.bookingGroupId,
      })

    if (!CurrentSlotBookingsGroup.length) {
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

  let wallet = await this._walletRepository.findOne({
  userRef: initialBooking.customerRef,
})

if (!wallet) {
  wallet = await this._walletRepository.save({
    walletId: `WAL_${crypto.randomUUID()}`,
    userRef: initialBooking.customerRef,
    userType: 'customer',
    currency: payment.advancePayment?.currency || 'INR',
    balance: 0,
    isActive: true,
  })
}



    if (!wallet || !wallet._id) {
      throw new CustomError(
        ERROR_MESSAGES.FILE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

     //CONSTRAINT CHECKS

    let nearestServiceSlotDate: Date | null = null

    for (const booking of CurrentSlotBookingsGroup) {
      if (
        booking.serviceStatus === 'scheduled' &&
        booking.slotStart instanceof Date
      ) {
        if (
          !nearestServiceSlotDate ||
          booking.slotStart < nearestServiceSlotDate
        ) {
          nearestServiceSlotDate = booking.slotStart
        }
      }
    }

    if (!nearestServiceSlotDate) {
      throw new CustomError(
        'No cancellable slots found',
        HTTP_STATUS.METHOD_NOT_ALLOWED,
      )
    }
    const now = Date.now()

    if (nearestServiceSlotDate.getTime() <= now) {
      throw new CustomError(
        'Cancellation is not allowed once the service has started',
        HTTP_STATUS.METHOD_NOT_ALLOWED,
      )
    }

    const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000
    const timeDiff = nearestServiceSlotDate.getTime() - Date.now()

    const considerRefundableAdvanceAmount = timeDiff >= TWO_DAYS_MS

    //REFUND CALCULATION 

    const refundDetailsPerSlot: { bookingId: string; amount: number }[] = []
    let refundableAdvanceAmount = 0

    for (const booking of CurrentSlotBookingsGroup) {
      if (booking.serviceStatus !== 'scheduled') continue

      const paymentSlot = payment.slots.find(
        (s) => s.bookingId === booking.bookingId,
      )

      if (paymentSlot) {
        refundableAdvanceAmount += paymentSlot.pricing.advanceAmount
        refundDetailsPerSlot.push({
          bookingId: booking.bookingId,
          amount: paymentSlot.pricing.advanceAmount,
        })
      }
    }

    // WALLET REFUND 

    if (considerRefundableAdvanceAmount && refundableAdvanceAmount > 0) {
      const admin = await this._adminRepository.findOne({
        email: process.env.SEED_ADMIN_EMAIL,
      })

      if (!admin || !admin._id) {
        throw new CustomError("Admin not found", HTTP_STATUS.NOT_FOUND)
      }

      const adminWallet = await this._walletRepository.findOne({
        userRef: admin._id.toString(),
      })

      if (!adminWallet || !adminWallet._id) {
        throw new CustomError("Admin wallet not found", HTTP_STATUS.NOT_FOUND)
      }

      await this._walletTransactionRepository.save({
        transactionId: `WTXN_${crypto.randomUUID()}`,
        walletRef: adminWallet._id,
        userRef: admin._id.toString(),
        type: 'debit',
        source: 'booking-refund',
        amount: refundableAdvanceAmount,
        currency: payment.advancePayment?.currency || 'INR',
        description: `Refund for booking group ${initialBooking.bookingGroupId}`,
        paymentRef: payment._id,
      })

      await this._walletRepository.decrementBalance(
        adminWallet._id,
        refundableAdvanceAmount
      )
      await this._walletTransactionRepository.save({
        transactionId: `WTXN_${crypto.randomUUID()}`,
        walletRef: wallet._id,
        userRef: initialBooking.customerRef,
        type: 'credit',
        source: 'booking-refund',
        amount: refundableAdvanceAmount,
        currency: payment.advancePayment?.currency || 'INR',
        description: `Refund for cancelled booking group ${initialBooking.bookingGroupId}`,
        paymentRef: payment._id,
      })

     
      await this._walletRepository.incrementBalance(
        wallet._id,
        refundableAdvanceAmount
      )
    }



    if (!considerRefundableAdvanceAmount && refundableAdvanceAmount > 0) {

      const admin = await this._adminRepository.findOne({
        email: process.env.SEED_ADMIN_EMAIL,
      })

      if (!admin || !admin._id) {
        throw new CustomError("Admin not found", HTTP_STATUS.NOT_FOUND)
      }

      const adminWallet = await this._walletRepository.findOne({
        userRef: admin._id.toString(),
      })

      if (!adminWallet || !adminWallet._id) {
        throw new CustomError("Admin wallet not found", HTTP_STATUS.NOT_FOUND)
      }

   

      let vendorWallet = await this._walletRepository.findOne({
  userRef: initialBooking.vendorRef,
})

if (!vendorWallet) {
  vendorWallet = await this._walletRepository.save({
    walletId: `WAL_${crypto.randomUUID()}`,
    userRef: initialBooking.vendorRef,
    userType: 'vendor',
    currency: payment.advancePayment?.currency || 'INR',
    balance: 0,
    isActive: true,
  })
}

if(!vendorWallet._id){
  throw new CustomError("Venoder wallet not found", HTTP_STATUS.NOT_FOUND)
}

      // Admin debit
      await this._walletTransactionRepository.save({
        transactionId: `WTXN_${crypto.randomUUID()}`,
        walletRef: adminWallet._id,
        userRef: admin._id.toString(),
        type: 'debit',
        source: 'service-payout',
        amount: refundableAdvanceAmount,
        currency: payment.advancePayment?.currency || 'INR',
        description: `Late cancellation payout for ${initialBooking.bookingGroupId}`,
        paymentRef: payment._id,
      })

      // Vendor credit
      await this._walletTransactionRepository.save({
        transactionId: `WTXN_${crypto.randomUUID()}`,
        walletRef: vendorWallet._id,
        userRef: initialBooking.vendorRef,
        type: 'credit',
        source: 'service-payout',
        amount: refundableAdvanceAmount,
        currency: payment.advancePayment?.currency || 'INR',
        description: `Late cancellation payout`,
        paymentRef: payment._id,
      })

      await this._walletRepository.decrementBalance(
        adminWallet._id,
        refundableAdvanceAmount
      )

      await this._walletRepository.incrementBalance(
        vendorWallet._id,
        refundableAdvanceAmount
      )
    }

    //  CANCEL BOOKINGS 

    for (const detail of refundDetailsPerSlot) {
      if (considerRefundableAdvanceAmount) {
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
      }

      await this._bookingRepository.update(
        { bookingId: detail.bookingId },
        {
          serviceStatus: 'cancelled',
          paymentStatus: considerRefundableAdvanceAmount
            ? 'refunded'
            : 'advance-paid',
          cancelInfo: {
            cancelledByRef: user._id.toString(),
            cancelledByRole: role,
            reason,
            cancelledAt: new Date(),
          },
        },
      )
    }
  }
}
