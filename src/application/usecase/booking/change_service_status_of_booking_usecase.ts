import { inject, injectable } from 'tsyringe'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'

import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { ChangeServiceStatusOfBookingRequestDTO } from '../../dtos/booking_dto'
import { IChangeServiceStatusOfBookingUseCase } from '../../../domain/useCaseInterfaces/booking/change_service_status_of_booking_usecase_interface'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { ICreateNotificationUseCase } from '../../../domain/useCaseInterfaces/notification/create_notification_usecase_interface'
import { IAdminRepository } from '../../../domain/repositoryInterfaces/users/admin_repository.interface'
import { IPaymentRepository } from '../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import { IWalletRepository } from '../../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'
import { IWalletTransactionRepository } from '../../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'
import { generateUniqueId } from '../../../shared/utils/unique_uuid.helper'



@injectable()
export class ChangeServiceStatusOfBookingUseCase
  implements IChangeServiceStatusOfBookingUseCase {
  constructor(
    @inject('IBookingRepository')
    private readonly _bookingRepository: IBookingRepository,

    @inject('IVendorRepository')
    private readonly _vendorRepository: IVendorRepository,

    @inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,

    @inject('ICustomerRepository')
    private readonly _customerRepository: ICustomerRepository,

    @inject('IAdminRepository')
    private readonly _adminRepository: IAdminRepository,

    @inject('IPaymentRepository')
    private readonly _paymentRepository: IPaymentRepository,

    @inject('IWalletRepository')
    private readonly _walletRepository: IWalletRepository,

    @inject('IWalletTransactionRepository')
    private readonly _walletTransactionRepository: IWalletTransactionRepository,
  ) { }

  async execute(
    input: ChangeServiceStatusOfBookingRequestDTO,
  ): Promise<{ updatedCount: number }> {
    //vendor validation
    const vendor = await this._vendorRepository.findOne({
      userId: input.userId,
    })

    if (!vendor || !vendor._id) {
      throw new CustomError(
        ERROR_MESSAGES.USERS_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    //Get all group bookings
    const groupBookings =
      await this._bookingRepository.findAllDocsWithoutPagination({
        bookingGroupId: input.bookingGroupId,
      })

    if (!groupBookings || groupBookings.length === 0) {
      throw new CustomError('Bookings not found', HTTP_STATUS.NOT_FOUND)
    }

    //check last slot end date
    let lastServiceSlotDate: Date | null = null

    for (const booking of groupBookings) {
      if (booking.slotEnd instanceof Date) {
        if (!lastServiceSlotDate || booking.slotEnd > lastServiceSlotDate) {
          lastServiceSlotDate = booking.slotEnd
        }
      }
    }

    const now = Date.now()

    if (lastServiceSlotDate && lastServiceSlotDate.getTime() > now) {
      throw new CustomError(
        "Cannot mark as completed before last slot ends.",
        HTTP_STATUS.METHOD_NOT_ALLOWED,
      )
    }

    //get payment
    const payment = await this._paymentRepository.findOne({
      bookingGroupId: input.bookingGroupId,
    })

    //calculating total advance amount


    const paymentSlotMap = new Map()

    if (payment?.slots?.length) {
      for (const slot of payment.slots) {
        paymentSlotMap.set(slot.bookingId, slot)
      }
    }

    let totalAdvanceAmount = 0

    if (payment?.advancePayment?.status === 'paid') {
      totalAdvanceAmount = payment.advancePayment.amount
    }
    //=============================

    //get admin
    const admin = await this._adminRepository.findOne({
      email: process.env.SEED_ADMIN_EMAIL,
    })

    if (!admin || !admin._id) {
      throw new CustomError('Admin not found', HTTP_STATUS.NOT_FOUND)
    }

    //wallet settlements
    if (totalAdvanceAmount > 0) {
      const adminWallet = await this._walletRepository.findOne({
        userRef: admin._id,
      })

      if (!adminWallet || !adminWallet._id) {
        throw new CustomError(
          'Admin wallet not found',
          HTTP_STATUS.NOT_FOUND,
        )
      }

      if (adminWallet.balance && adminWallet.balance < totalAdvanceAmount) {
        throw new CustomError(
          'Insufficient admin wallet balance',
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        )
      }

      let vendorWallet = await this._walletRepository.findOne({
        userRef: vendor._id,
      })

      if (!vendorWallet) {
        vendorWallet = await this._walletRepository.save({
          balance: 0,
          currency: 'INR',
          isActive: true,
          userRef: vendor._id.toString(),
          walletId: generateUniqueId(),
          userType: 'vendor',

        })
      }

      if (!vendorWallet?._id) {
        throw new CustomError(
          'Vendor wallet not found',
          HTTP_STATUS.NOT_FOUND,
        )
      }

      //Transfer for each booking
      for (const booking of groupBookings) {
        const slot = paymentSlotMap.get(booking.bookingId)

        if (slot?.status === 'advance-paid') {
          const amount = slot.advanceRefund?.amount || 0

          if (amount <= 0) continue

          //admin debt
          await this._walletTransactionRepository.save({
            bookingRef: booking._id,
            currency: 'INR',
            paymentRef: payment?._id,
            source: 'admin-adjustment',
            stripePaymentIntentId:
              payment?.advancePayment?.stripePaymentIntentId,
            transactionId: generateUniqueId(),
            type: 'debit',
            amount,
            userRef: admin._id.toString(),
            description: 'Advance money is debited'
          })

          await this._walletRepository.decrementBalance(
            adminWallet._id,
            amount,
          )

          //vendor credit
          await this._walletTransactionRepository.save({
            bookingRef: booking._id,
            currency: 'INR',
            paymentRef: payment?._id,
            source: 'admin-adjustment',
            stripePaymentIntentId:
              payment?.advancePayment?.stripePaymentIntentId,
            transactionId: generateUniqueId(),
            type: 'credit',
            amount,
            userRef: vendor._id.toString(),
            description: "Advance money is credited"
          })

          await this._walletRepository.incrementBalance(
            vendorWallet._id,
            amount,
          )
        }
      }
    }

    //updating booking status
    const updatedCount = await this._bookingRepository.updateMany(
      {
        bookingGroupId: input.bookingGroupId,
        serviceStatus: 'scheduled',
      },
      {
        serviceStatus: 'completed',
      },
    )

    if (updatedCount === 0) {
      throw new CustomError(
        'No bookings to update',
        HTTP_STATUS.BAD_REQUEST,
      )
    }

    //notify customer
    const customer = await this._customerRepository.findOne({
      _id: groupBookings[0].customerRef.toString(),
    })

    if (!customer?.userId) {
      throw new CustomError(
        ERROR_MESSAGES.USERS_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }

    await this._createNotificationUseCase.execute({
      recipientId: customer.userId,
      recipientRole: 'customer',
      type: 'SERVICE_COMPLETED',
      title: 'Service Completed',
      message: `Service has been marked as completed by ${vendor.name}.`,
    })

    return { updatedCount }
  }
}