



// import { inject, injectable } from 'tsyringe'
// import { CancelBookingRequestDTO } from '../../../dtos/booking_dto'
// import { CustomError } from '../../../../domain/utils/custom.error'
// import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'

// import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
// import { IVendorCancelBookingStrategyInterface } from './vendor_cancel_booking_strategy.interface'
// import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
// import { IPaymentRepository } from '../../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
// import { IWalletRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'
// import { IWalletTransactionRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'
// import { IAdminRepository } from '../../../../domain/repositoryInterfaces/users/admin_repository.interface'

// @injectable()
// export class VendorCancelBookingStrategy implements IVendorCancelBookingStrategyInterface {
//   constructor(
//     @inject('IVendorRepository')
//     private _vendorRepository: IVendorRepository,
//     @inject('IAdminRepository')
//     private _adminRepository: IAdminRepository,
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
//     const CurrentSlotBookingsGroup =
//       await this._bookingRepository.findAllDocsWithoutPagination({
//         bookingGroupId: initialBooking.bookingGroupId,
//       })

//     if (!CurrentSlotBookingsGroup.length) {
//       throw new CustomError(
//         ERROR_MESSAGES.NO_BOOKING_FOUND,
//         HTTP_STATUS.NOT_FOUND,
//       )
//     }

//     const user = await this._vendorRepository.findOne({ userId })
//     if (!user || !user._id) {
//       throw new CustomError(
//         ERROR_MESSAGES.FILE_NOT_FOUND,
//         HTTP_STATUS.NOT_FOUND,
//       )
//     }

//     if (initialBooking.vendorRef !== user._id.toString()) {
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
//     //constraint check

//     let nearestServiceSlotDate: Date | null = null
// //find the nearest booking slot date through looping the booking group full
//     for (const booking of CurrentSlotBookingsGroup) {
//       if (
//         booking.serviceStatus === 'scheduled' &&
//         booking.slotStart instanceof Date
//       ) {
//         if (
//           !nearestServiceSlotDate ||
//           booking.slotStart < nearestServiceSlotDate
//         ) {
//           nearestServiceSlotDate = booking.slotStart
//         }
//       }
//     }

//     const now = Date.now()
// //if the date of the service is now , no cancellation possible
//     if (nearestServiceSlotDate && nearestServiceSlotDate.getTime() <= now) {
//       throw new CustomError(
//         'Cancellation is not allowed once the service has started',
//         HTTP_STATUS.METHOD_NOT_ALLOWED,
//       )
//     }
//     //refund calculation

//     const refundDetailsPerSlot: { bookingId: string; amount: number }[] = []
//     let refundableAdvanceAmount = 0

//     for (const booking of CurrentSlotBookingsGroup) {
//       if (booking.serviceStatus !== 'scheduled') continue

//       const paymentSlot = payment.slots.find(
//         (s) => s.bookingId === booking.bookingId,
//       )

//       if (paymentSlot) {
//         refundableAdvanceAmount += paymentSlot.pricing.advanceAmount
//         refundDetailsPerSlot.push({
//           bookingId: booking.bookingId,
//           amount: paymentSlot.pricing.advanceAmount,
//         })
//       }

//       if (refundableAdvanceAmount > 0) {
//         await this._walletTransactionRepository.save({
//           transactionId: `WTXN_${crypto.randomUUID()}`,
//           walletRef: wallet._id,
//           // userRef: initialBooking.vendorRef,
//           userRef: initialBooking.customerRef,
//           type: 'credit',
//           source: 'booking-refund',
//           amount: refundableAdvanceAmount,
//           currency: payment.advancePayment?.currency || 'INR',
//           description: `Refund for cancelled booking group ${initialBooking.bookingGroupId}`,
//           paymentRef: payment._id,
//         })

//         await this._walletRepository.update(
//           { walletId: wallet.walletId },
//           { balance: (wallet.balance ?? 0) + refundableAdvanceAmount },
//         )
//       }

//       //cancel booking

//       for (const detail of refundDetailsPerSlot) {
//         await this._paymentRepository.updateSlotAdvanceRefund(
//           payment.paymentId,
//           detail.bookingId,
//           {
//             refundId: `REF_${crypto.randomUUID()}`,
//             amount: detail.amount,
//             status: 'succeeded',
//             initiatedBy: role,
//             initiatedByUserId: user._id.toString(),
//             createdAt: new Date(),
//             failures: [],
//           },
//         )

//         await this._bookingRepository.update(
//           { bookingId: detail.bookingId },
//           {
//             serviceStatus: 'cancelled',
//             paymentStatus: 'refunded',
//             cancelInfo: {
//               cancelledByRef: user._id.toString(),
//               cancelledByRole: role,
//               reason,
//               cancelledAt: new Date(),
//             },
//           },
//         )
//       }
//     }
//   }
// }
















import { inject, injectable } from 'tsyringe'
import { CancelBookingRequestDTO } from '../../../dtos/booking_dto'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'

import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IVendorCancelBookingStrategyInterface } from './vendor_cancel_booking_strategy.interface'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IPaymentRepository } from '../../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import { IWalletRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'
import { IWalletTransactionRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'
import { IAdminRepository } from '../../../../domain/repositoryInterfaces/users/admin_repository.interface'

@injectable()
export class VendorCancelBookingStrategy implements IVendorCancelBookingStrategyInterface {
  constructor(
    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository,
    @inject('IAdminRepository')
    private _adminRepository: IAdminRepository,
    @inject('IBookingRepository')
    private _bookingRepository: IBookingRepository,
    @inject('IPaymentRepository')
    private _paymentRepository: IPaymentRepository,
    @inject('IWalletRepository')
    private _walletRepository: IWalletRepository,
    @inject('IWalletTransactionRepository')
    private _walletTransactionRepository: IWalletTransactionRepository,
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

    const user = await this._vendorRepository.findOne({ userId })
    if (!user || !user._id) {
      throw new CustomError(
        ERROR_MESSAGES.FILE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    if (initialBooking.vendorRef !== user._id.toString()) {
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
//==========================================================================================================
    if (!wallet || !wallet._id) {
      throw new CustomError(
        ERROR_MESSAGES.FILE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }
    //constraint check

    let nearestServiceSlotDate: Date | null = null
    //find the nearest booking slot date through looping the booking group full
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

    const now = Date.now()
    //if the date of the service is now , no cancellation possible
    if (nearestServiceSlotDate && nearestServiceSlotDate.getTime() <= now) {
      throw new CustomError(
        'Cancellation is not allowed once the service has started',
        HTTP_STATUS.METHOD_NOT_ALLOWED,
      )
    }
    //refund calculation

    // const refundDetailsPerSlot: { bookingId: string; amount: number }[] = []
    // let refundableAdvanceAmount = 0

    // for (const booking of CurrentSlotBookingsGroup) {
    //   if (booking.serviceStatus !== 'scheduled') continue

    //   const paymentSlot = payment.slots.find(
    //     (s) => s.bookingId === booking.bookingId,
    //   )

    //   if (paymentSlot) {
    //     refundableAdvanceAmount += paymentSlot.pricing.advanceAmount
    //     refundDetailsPerSlot.push({
    //       bookingId: booking.bookingId,
    //       amount: paymentSlot.pricing.advanceAmount,
    //     })
    //   }

    //   if (refundableAdvanceAmount > 0) {
    //     await this._walletTransactionRepository.save({
    //       transactionId: `WTXN_${crypto.randomUUID()}`,
    //       walletRef: wallet._id,
    //       // userRef: initialBooking.vendorRef,
    //       userRef: initialBooking.customerRef,
    //       type: 'credit',
    //       source: 'booking-refund',
    //       amount: refundableAdvanceAmount,
    //       currency: payment.advancePayment?.currency || 'INR',
    //       description: `Refund for cancelled booking group ${initialBooking.bookingGroupId}`,
    //       paymentRef: payment._id,
    //     })

    //     await this._walletRepository.update(
    //       { walletId: wallet.walletId },
    //       { balance: (wallet.balance ?? 0) + refundableAdvanceAmount },
    //     )
    //   }

    //   //cancel booking

    //   for (const detail of refundDetailsPerSlot) {
    //     await this._paymentRepository.updateSlotAdvanceRefund(
    //       payment.paymentId,
    //       detail.bookingId,
    //       {
    //         refundId: `REF_${crypto.randomUUID()}`,
    //         amount: detail.amount,
    //         status: 'succeeded',
    //         initiatedBy: role,
    //         initiatedByUserId: user._id.toString(),
    //         createdAt: new Date(),
    //         failures: [],
    //       },
    //     )

    //     await this._bookingRepository.update(
    //       { bookingId: detail.bookingId },
    //       {
    //         serviceStatus: 'cancelled',
    //         paymentStatus: 'refunded',
    //         cancelInfo: {
    //           cancelledByRef: user._id.toString(),
    //           cancelledByRole: role,
    //           reason,
    //           cancelledAt: new Date(),
    //         },
    //       },
    //     )
    //   }
    // }

    let refundableAdvanceAmount = 0
    const refundDetailsPerSlot: { bookingId: string; amount: number }[] = []

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
    if (refundableAdvanceAmount > 0) {

    
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

      //  Admin Debit Transaction
      await this._walletTransactionRepository.save({
        transactionId: `WTXN_${crypto.randomUUID()}`,
        walletRef: adminWallet._id,
        userRef: admin._id.toString(),
        type: 'debit',
        source: 'booking-refund',
        amount: refundableAdvanceAmount,
        currency: payment.advancePayment?.currency || 'INR',
        description: `Vendor cancelled booking group ${initialBooking.bookingGroupId}`,
        paymentRef: payment._id,
      })

      // Customer Credit Transaction
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

      await this._walletRepository.decrementBalance(
        adminWallet._id,
        refundableAdvanceAmount
      )

      await this._walletRepository.incrementBalance(
        wallet._id,
        refundableAdvanceAmount
      )
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
          serviceStatus: 'cancelled',
          paymentStatus: 'refunded',
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
