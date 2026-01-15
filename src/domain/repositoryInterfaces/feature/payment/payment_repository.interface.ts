import { IPaymentModel } from '../../../../interfaceAdapters/database/mongoDb/models/payment_model'
import { TRefundStatus, TRole } from '../../../../shared/constants'
import { IBaseFailure, IPaymentEntity } from '../../../models/payment_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface IPaymentRepository
  extends IBaseRepository<IPaymentModel, IPaymentEntity> {
  updateSlotAdvanceRefund(
    paymentId: string,
    bookingId: string,
    refund: {
      refundId: string
      amount: number
      status: TRefundStatus
      initiatedBy: TRole
      initiatedByUserId: string
      createdAt: Date
      failures: IBaseFailure[]
    }
  ): Promise<void>

  updateRemainingPaymentByBookingId(
    bookingId: string,
    remainingPayment: {
      stripePaymentIntentId: string
      amount: number
      status: 'paid' | 'failed'
      paidAt: Date
      failures: IBaseFailure[]
    }
  ): Promise<void>

  updateRemainingPaymentByBookingGroupId(
    bookingGroupId: string,
    remainingPayment: {
      stripePaymentIntentId: string
      amount: number
      status: 'paid' | 'failed'
      paidAt: Date
      failures: IBaseFailure[]
    }
  ): Promise<void>

  findAllPayments(
    page: number,
    limit: number,
    filter: any
  ): Promise<{
    data: IPaymentEntity[]
    currentPage: number
    totalPages: number
    totalCount: number
  }>
}
