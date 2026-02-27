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
import { ICreateNotificationUseCase } from '../../../domain/useCaseInterfaces/notification/create_notification_usecase_interface'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IChatRepository } from '../../../domain/repositoryInterfaces/feature/chat/chat_repository.interface'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { v4 as uuidv4 } from 'uuid'
import { IAdminRepository } from '../../../domain/repositoryInterfaces/users/admin_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'

@injectable()
export class StripePaymentSucceededUseCase implements IStripePaymentSucceedUseCase {
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
    private _walletRepository: IWalletRepository,

    @inject('ICreateNotificationUseCase')
    private _createNotificationUseCase: ICreateNotificationUseCase,

    @inject('ICustomerRepository')
    private _customerRepository: ICustomerRepository,

    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository,


    @inject('IAdminRepository')
    private _adminRepostory: IAdminRepository,

    @inject('IChatRepository')
    private _chatRepository: IChatRepository,

    @inject('IServiceRepository')
    private _serviceRepository: IServiceRepository,
  ) { }

  async execute(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const hold =
      (await this._bookingHoldRepository.findByStripePaymentIntentId(
        paymentIntent.id,
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
        addressId: hold.addressId,

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



    // await this._walletTransactionRepository.save({
    //   transactionId: `WTXN_${crypto.randomUUID()}`,
    //   walletRef: wallet._id,
    //   userRef: hold.customerRef,
    //   type: 'debit',
    //   source: 'service-booking',
    //   amount: hold.pricing.advanceAmount,
    //   currency: 'INR',
    //   description: `Advance payment for ${hold.holdId}`,
    //   bookingHoldRef: hold._id,
    //   paymentRef: payment._id,
    //   stripePaymentIntentId: paymentIntent.id,
    // })

    const admin = await this._adminRepostory.findOne({
      email: process.env.SEED_ADMIN_EMAIL,
    })

    if (!admin || !admin._id) {
      throw new CustomError("Admin not found", HTTP_STATUS.NOT_FOUND)
    }

    let adminWallet = await this._walletRepository.findOne({
      userRef: admin._id.toString(),
    })

    if (!adminWallet) {
      adminWallet = await this._walletRepository.save({
        walletId: `WAL_${crypto.randomUUID()}`,
        userRef: admin._id.toString(),
        userType: 'admin',
        currency: 'INR',
        isActive: true,
        balance: 0,
      })
    }

    if (!adminWallet._id) {
      throw new CustomError("Admin Wallet has error receiving amount", HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }

    await this._walletTransactionRepository.save({
      transactionId: `WTXN_${crypto.randomUUID()}`,
      walletRef: adminWallet._id,
      userRef: admin._id.toString(),
      type: 'credit',
      source: 'service-booking',
      amount: hold.pricing.advanceAmount,
      currency: 'INR',
      description: `Advance payment for ${hold.holdId}`,
      bookingHoldRef: hold._id,
      paymentRef: payment._id,
      stripePaymentIntentId: paymentIntent.id,
    })

    await this._walletRepository.incrementBalance(
      adminWallet._id,
      hold.pricing.advanceAmount
    )

    await this._bookingHoldRepository.markHoldAsCompleted(hold.holdId)
const customer = await this._customerRepository.findOne({
      _id: hold.customerRef,
    })

    if(!customer ){
      throw new CustomError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    if(!customer.userId){
      throw new CustomError("User not found",HTTP_STATUS.NOT_FOUND)
    }

    for (const slot of hold.slots) {
      await this._redisSlotLockRepository.releaseSlot(
        hold.serviceRef,
        slot.date,
        slot.start,
        customer?.userId
      )
    }

    
    const vendor = await this._vendorRepository.findOne({
      _id: hold.vendorRef,
    })

    if (customer) {
      await this._createNotificationUseCase.execute({
        recipientId: customer.userId as string,
        recipientRole: 'customer',
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Successful',
        message: `Advance payment successful for booking group ${hold.holdId}`,
        metadata: { bookingId: hold.holdId },
      })
    }

    if (vendor) {
      await this._createNotificationUseCase.execute({
        recipientId: vendor.userId as string,
        recipientRole: 'vendor',
        type: 'PAYMENT_SUCCESS',
        title: 'New Payment Received',
        message: `New advance payment received for booking group ${hold.holdId}`,
        metadata: { bookingId: hold.holdId },
      })
    }

    // Chat Creation Logic
    if (customer && vendor && customer._id && vendor._id) {
      const service = await this._serviceRepository.findOne({
        _id: hold.serviceRef,
      })
      console.log('Chat creation check:', {
        customer: customer._id.toString(),
        vendor: vendor._id.toString(),
        service: service?._id ? service._id.toString() : '',
      })

      if (service && service._id) {
        const existingChat = await this._chatRepository.findChatByParticipants(
          customer._id.toString(),
          vendor._id.toString(),
          service._id.toString(),
        )

        if (!existingChat) {
          await this._chatRepository.createChat({
            chatId: uuidv4(),
            customerRef: customer._id.toString(),
            vendorRef: vendor._id.toString(),
            serviceRef: service._id.toString(),
            unreadCount: {
              customer: 0,
              vendor: 0,
            },
            isActive: true,
            lastMessage: undefined,
          })
        }
      }
    }
  }
}
