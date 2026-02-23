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

@injectable()
export class BalancePaymentSucceededUseCase implements IBalancePaymentSucceededUseCase {
  constructor(
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
  ) {}

  async execute(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const bookingGroupId = paymentIntent.metadata?.bookingGroupId
    const paymentType = paymentIntent.metadata?.paymentType

    if (!bookingGroupId || paymentType !== 'balance') {
      return
    }

    const payment = await this._paymentRepository.findOne({
      bookingGroupId: bookingGroupId,
    })

    if (!payment) return

    await this._paymentRepository.updateRemainingPaymentByBookingGroupId(
      bookingGroupId,
      {
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount_received / 100,
        status: 'paid',
        paidAt: new Date(),
        failures: [],
      },
    )

    let wallet = await this._walletRepository.findOne({
      userRef: payment.customerRef,
    })

    if (!wallet) {
      wallet = await this._walletRepository.save({
        walletId: `WAL_${crypto.randomUUID()}`,
        userRef: payment.customerRef,
        userType: 'customer',
        currency: 'INR',
        isActive: true,
        balance: 0,
      })
    }
    await this._walletTransactionRepository.save({
      transactionId: `WTXN_${crypto.randomUUID()}`,
      walletRef: wallet._id,
      userRef: payment.customerRef,
      type: 'debit',
      source: 'balance-payment',
      amount: paymentIntent.amount_received / 100,
      currency: 'INR',
      description: `Balance payment for ${bookingGroupId}`,
      paymentRef: payment._id,
      stripePaymentIntentId: paymentIntent.id,
    })

    // await this._walletRepository.update(
    //   { walletId: wallet.walletId },
    //   { balance: (wallet.balance ?? 0) + paymentIntent.amount / 100 },
    // )

    const bookings = await this._bookingRepository.findAllDocsWithoutPagination(
      {
        bookingGroupId,
      },
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
    const vendor = await this._vendorRepository.findOne({
      _id: payment.vendorRef,
    })

    if (customer) {
      await this._createNotificationUseCase.execute({
        recipientId: customer.userId as string,
        recipientRole: 'customer',
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Completed',
        message: `Balance payment successful for booking group ${payment.bookingGroupId}`,
        metadata: { bookingId: payment.bookingGroupId },
      })
    }

    if (vendor) {
      await this._createNotificationUseCase.execute({
        recipientId: vendor.userId as string,
        recipientRole: 'vendor',
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Received',
        message: `Balance payment received for booking group ${payment.bookingGroupId}`,
        metadata: { bookingId: payment.bookingGroupId },
      })
    }
  }
}
