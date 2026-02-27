// import { inject, injectable } from 'tsyringe'
// import Stripe from 'stripe'
// import { IBalancePaymentSucceededUseCase } from '../../../domain/useCaseInterfaces/booking/balance_payment_succeeded_usecase_interface'
// import { IPaymentRepository } from '../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
// import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
// import { ICreateNotificationUseCase } from '../../../domain/useCaseInterfaces/notification/create_notification_usecase_interface'
// import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
// import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
// import { IWalletTransactionRepository } from '../../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'
// import { IWalletRepository } from '../../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'

// @injectable()
// export class BalancePaymentSucceededUseCase implements IBalancePaymentSucceededUseCase {
//   constructor(
//     @inject('IPaymentRepository')
//     private readonly _paymentRepository: IPaymentRepository,
//     @inject('IBookingRepository')
//     private readonly _bookingRepository: IBookingRepository,
//     @inject('ICreateNotificationUseCase')
//     private readonly _createNotificationUseCase: ICreateNotificationUseCase,
//     @inject('ICustomerRepository')
//     private readonly _customerRepository: ICustomerRepository,
//     @inject('IVendorRepository')
//     private readonly _vendorRepository: IVendorRepository,
//     @inject('IWalletTransactionRepository')
//     private readonly _walletTransactionRepository: IWalletTransactionRepository,
//     @inject('IWalletRepository')
//     private readonly _walletRepository: IWalletRepository,
//   ) {}

//   async execute(paymentIntent: Stripe.PaymentIntent): Promise<void> {
//     const bookingGroupId = paymentIntent.metadata?.bookingGroupId
//     const paymentType = paymentIntent.metadata?.paymentType

//     if (!bookingGroupId || paymentType !== 'balance') {
//       return
//     }


//     const payment = await this._paymentRepository.findOne({
//       bookingGroupId: bookingGroupId,
//     })

//     if (!payment) return
//=================================================
//     await this._paymentRepository.updateRemainingPaymentByBookingGroupId(
//       bookingGroupId,
//       {
//         stripePaymentIntentId: paymentIntent.id,
//         amount: paymentIntent.amount_received / 100,
//         status: 'paid',
//         paidAt: new Date(),
//         failures: [],
//       },
//     )

//     let wallet = await this._walletRepository.findOne({
//       userRef: payment.customerRef,
//     })

//     if (!wallet) {
//       wallet = await this._walletRepository.save({
//         walletId: `WAL_${crypto.randomUUID()}`,
//         userRef: payment.customerRef,
//         userType: 'customer',
//         currency: 'INR',
//         isActive: true,
//         balance: 0,
//       })
//     }
//     await this._walletTransactionRepository.save({
//       transactionId: `WTXN_${crypto.randomUUID()}`,
//       walletRef: wallet._id,
//       userRef: payment.customerRef,
//       type: 'debit',
//       source: 'balance-payment',
//       amount: paymentIntent.amount_received / 100,
//       currency: 'INR',
//       description: `Balance payment for ${bookingGroupId}`,
//       paymentRef: payment._id,
//       stripePaymentIntentId: paymentIntent.id,
//     })



//     // await this._walletRepository.update(
//     //   { walletId: wallet.walletId },
//     //   { balance: (wallet.balance ?? 0) + paymentIntent.amount / 100 },
//     // )

//     const bookings = await this._bookingRepository.findAllDocsWithoutPagination(
//       {
//         bookingGroupId,
//       },
//     )
//     for (const booking of bookings) {
//       await this._bookingRepository.update(
//         { bookingId: booking.bookingId },
//         { paymentStatus: 'fully-paid' },
//       )
//     }

//     const customer = await this._customerRepository.findOne({
//       _id: payment.customerRef,
//     })
//     const vendor = await this._vendorRepository.findOne({
//       _id: payment.vendorRef,
//     })

//     if (customer) {
//       await this._createNotificationUseCase.execute({
//         recipientId: customer.userId as string,
//         recipientRole: 'customer',
//         type: 'PAYMENT_SUCCESS',
//         title: 'Payment Completed',
//         message: `Balance payment successful for booking group ${payment.bookingGroupId}`,
//         metadata: { bookingId: payment.bookingGroupId },
//       })
//     }

//     if (vendor) {
//       await this._createNotificationUseCase.execute({
//         recipientId: vendor.userId as string,
//         recipientRole: 'vendor',
//         type: 'PAYMENT_SUCCESS',
//         title: 'Payment Received',
//         message: `Balance payment received for booking group ${payment.bookingGroupId}`,
//         metadata: { bookingId: payment.bookingGroupId },
//       })
//     }
//   }
// }








import { inject, injectable } from 'tsyringe'
import Stripe from 'stripe'
import { IBalancePaymentSucceededUseCase } from '../../../domain/useCaseInterfaces/booking/balance_payment_succeeded_usecase_interface'
import { IPaymentRepository } from '../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { ICreateNotificationUseCase } from '../../../domain/useCaseInterfaces/notification/create_notification_usecase_interface'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IWalletTransactionRepository } from '../../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'
import { IWalletRepository } from '../../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'
import { IAdminRepository } from '../../../domain/repositoryInterfaces/users/admin_repository.interface'
import crypto from 'crypto'
@injectable()
export class BalancePaymentSucceededUseCase
  implements IBalancePaymentSucceededUseCase {
  constructor(
    @inject('IAdminRepository')
    private readonly _adminRepository: IAdminRepository,

    @inject('IPaymentRepository')
    private readonly _paymentRepository: IPaymentRepository,

    @inject('IBookingRepository')
    private readonly _bookingRepository: IBookingRepository,

    @inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,

    @inject('ICustomerRepository')
    private readonly _customerRepository: ICustomerRepository,

    @inject('IVendorRepository')
    private readonly _vendorRepository: IVendorRepository,

    @inject('IWalletTransactionRepository')
    private readonly _walletTransactionRepository: IWalletTransactionRepository,

    @inject('IWalletRepository')
    private readonly _walletRepository: IWalletRepository,
  ) { }

  async execute(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const bookingGroupId = paymentIntent.metadata?.bookingGroupId
    const paymentType = paymentIntent.metadata?.paymentType

    if (!bookingGroupId || paymentType !== 'balance') return


    const payment = await this._paymentRepository.findOne({
      bookingGroupId,
    })

    if (!payment) {
      throw new CustomError(
        'Payment details not found',
        HTTP_STATUS.NOT_FOUND,
      )
    }



    const alreadyProcessed = payment.slots.some(
      (slot) =>
        slot.remainingPayment?.stripePaymentIntentId === paymentIntent.id &&
        slot.remainingPayment?.status === 'paid'
    )

    if (alreadyProcessed) {
      return
    }

    const bookings =
      await this._bookingRepository.findAllDocsWithoutPagination({
        bookingGroupId,
      })

    if (!bookings.length) {
      throw new CustomError(
        'Booking data not found',
        HTTP_STATUS.NOT_FOUND,
      )
    }

    const isCompleted = bookings.every(
      (b) => b.serviceStatus === 'completed',
    )

    if (!isCompleted) {
      throw new CustomError(
        'Service not completed yet',
        HTTP_STATUS.BAD_REQUEST,
      )
    }

    const admin = await this._adminRepository.findOne({
      email: process.env.SEED_ADMIN_EMAIL,
    })

    if (!admin?._id) {
      throw new CustomError(
        'Admin not found',
        HTTP_STATUS.NOT_FOUND,
      )
    }

    const adminWallet = await this._walletRepository.findOne({
      userRef: admin._id,
    })

    if (!adminWallet?._id) {
      throw new CustomError(
        'Admin wallet not found',
        HTTP_STATUS.NOT_FOUND,
      )
    }


    const vendor = await this._vendorRepository.findOne({
      _id: payment.vendorRef,
    })

    if (!vendor?._id) {
      throw new CustomError(
        'Vendor not found',
        HTTP_STATUS.NOT_FOUND,
      )
    }

    let vendorWallet = await this._walletRepository.findOne({
      userRef: vendor._id,
    })

    if (!vendorWallet) {
      vendorWallet = await this._walletRepository.save({
        walletId: `WAL_${crypto.randomUUID()}`,
        userRef: vendor._id.toString(),
        userType: 'vendor',
        currency: 'INR',
        isActive: true,
        balance: 0,
      })
    }

    if (!vendorWallet?._id) {
      throw new CustomError(
        'Vendor wallet not found',
        HTTP_STATUS.NOT_FOUND,
      )
    }


    const amount = paymentIntent.amount_received / 100


    await this._paymentRepository.updateRemainingPaymentByBookingGroupId(
      bookingGroupId,
      {
        stripePaymentIntentId: paymentIntent.id,
        amount,
        status: 'paid',
        paidAt: new Date(),
        failures: [],
      },
    )


    await this._walletTransactionRepository.save({
      transactionId: `WTXN_${crypto.randomUUID()}`,
      userRef: admin._id.toString(),
      walletRef: adminWallet._id,
      type: 'credit',
      source: 'stripe-balance-payment',
      amount,
      currency: 'INR',
      paymentRef: payment._id,
      stripePaymentIntentId: paymentIntent.id,
      description: 'Balance payment credited to platform',
    })

    await this._walletRepository.incrementBalance(
      adminWallet._id,
      amount,
    )


    const commissionPercentage = 5
    const commissionAmount = Math.floor(
      (amount * commissionPercentage) / 100,
    )
    const vendorShare = amount - commissionAmount


    await this._walletTransactionRepository.save({
      transactionId: `WTXN_${crypto.randomUUID()}`,
      userRef: admin._id.toString(),
      walletRef: adminWallet._id,
      type: 'debit',
      source: 'vendor-settlement',
      amount: vendorShare,
      currency: 'INR',
      paymentRef: payment._id,
      description: 'Vendor settlement payout',
    })

    await this._walletRepository.decrementBalance(
      adminWallet._id,
      vendorShare,
    )


    await this._walletTransactionRepository.save({
      transactionId: `WTXN_${crypto.randomUUID()}`,
      userRef: vendor._id.toString(),
      walletRef: vendorWallet._id,
      type: 'credit',
      source: 'vendor-settlement',
      amount: vendorShare,
      currency: 'INR',
      paymentRef: payment._id,
      description: 'Vendor payout credited',
    })

    await this._walletRepository.incrementBalance(
      vendorWallet._id,
      vendorShare,
    )


    for (const booking of bookings) {
      await this._bookingRepository.update(
        { bookingId: booking.bookingId },
        { paymentStatus: 'fully-paid' },
      )
    }


    const customer = await this._customerRepository.findOne({
      _id: payment.customerRef,
    })

    if (customer?.userId) {
      await this._createNotificationUseCase.execute({
        recipientId: customer.userId,
        recipientRole: 'customer',
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Completed',
        message: `Balance payment successful for booking group ${bookingGroupId}`,
        metadata: { bookingId: bookingGroupId },
      })
    }

    if (vendor.userId) {
      await this._createNotificationUseCase.execute({
        recipientId: vendor.userId,
        recipientRole: 'vendor',
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Received',
        message: `Balance payment received for booking group ${bookingGroupId}`,
        metadata: { bookingId: bookingGroupId },
      })
    }
  }
}