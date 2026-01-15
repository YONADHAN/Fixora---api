import { injectable } from 'tsyringe'
import { FilterQuery, Types } from 'mongoose'

import { BaseRepository } from '../../base_repository'
import {
  PaymentModel,
  IPaymentModel,
} from '../../../database/mongoDb/models/payment_model'

import '../../../database/mongoDb/models/service_model'

import { IPaymentRepository } from '../../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import {
  IBaseFailure,
  IPaymentEntity,
} from '../../../../domain/models/payment_entity'
import { PaymentMongoBase } from '../../../database/mongoDb/types/payment_mongo_base'
import { TRefundStatus, TRole } from '../../../../shared/constants'

@injectable()
export class PaymentRepository
  extends BaseRepository<IPaymentModel, IPaymentEntity>
  implements IPaymentRepository {
  constructor() {
    super(PaymentModel)
  }

  protected toModel(entity: Partial<IPaymentEntity>): Partial<IPaymentModel> {
    return {
      paymentId: entity.paymentId,
      bookingGroupId: entity.bookingGroupId,

      customerRef: entity.customerRef
        ? new Types.ObjectId(entity.customerRef)
        : undefined,

      vendorRef: entity.vendorRef
        ? new Types.ObjectId(entity.vendorRef)
        : undefined,

      serviceRef: entity.serviceRef
        ? new Types.ObjectId(entity.serviceRef)
        : undefined,

      advancePayment: entity.advancePayment && {
        stripePaymentIntentId: entity.advancePayment.stripePaymentIntentId,
        amount: entity.advancePayment.amount,
        currency: entity.advancePayment.currency,
        status: entity.advancePayment.status,
        paidAt: entity.advancePayment.paidAt,
        failures: entity.advancePayment.failures.map((f) => ({
          code: f.code,
          message: f.message,
          type: f.type,
          stripeEventId: f.stripeEventId,
          occurredAt: f.occurredAt,
        })),
      },

      slots: entity.slots?.map((slot) => ({
        bookingId: slot.bookingId,

        pricing: {
          totalPrice: slot.pricing.totalPrice,
          advanceAmount: slot.pricing.advanceAmount,
          remainingAmount: slot.pricing.remainingAmount,
        },

        advanceRefund: slot.advanceRefund && {
          refundId: slot.advanceRefund.refundId,
          amount: slot.advanceRefund.amount,
          status: slot.advanceRefund.status,
          initiatedBy: slot.advanceRefund.initiatedBy,
          initiatedByUserId: new Types.ObjectId(
            slot.advanceRefund.initiatedByUserId
          ),
          createdAt: slot.advanceRefund.createdAt,
          failures: slot.advanceRefund.failures.map((f) => ({
            code: f.code,
            message: f.message,
            stripeEventId: f.stripeEventId,
            occurredAt: f.occurredAt,
          })),
        },

        remainingPayment: slot.remainingPayment && {
          stripePaymentIntentId: slot.remainingPayment.stripePaymentIntentId,
          amount: slot.remainingPayment.amount,
          status: slot.remainingPayment.status,
          paidAt: slot.remainingPayment.paidAt,
          failures: slot.remainingPayment.failures.map((f) => ({
            code: f.code,
            message: f.message,
            type: f.type,
            stripeEventId: f.stripeEventId,
            occurredAt: f.occurredAt,
          })),
        },

        status: slot.status,
      })),

      status: entity.status,
    }
  }

  protected toEntity(model: PaymentMongoBase): IPaymentEntity {
    return {
      _id: model._id.toString(),

      paymentId: model.paymentId,
      bookingGroupId: model.bookingGroupId,

      customerRef: model.customerRef?.toString(),
      vendorRef: model.vendorRef?.toString(),
      serviceRef: model.serviceRef?.toString(),

      advancePayment: {
        stripePaymentIntentId: model.advancePayment?.stripePaymentIntentId || '',
        amount: model.advancePayment?.amount || 0,
        currency: model.advancePayment?.currency || 'INR',
        status: model.advancePayment?.status || 'pending',
        paidAt: model.advancePayment?.paidAt,
        failures: (model.advancePayment?.failures || []).map((f) => ({
          code: f.code,
          message: f.message,
          type: f.type ?? 'api_error',
          stripeEventId: f.stripeEventId,
          occurredAt: f.occurredAt,
        })),
      },

      slots: (model.slots || []).map((slot) => ({
        bookingId: slot.bookingId,

        pricing: {
          totalPrice: slot.pricing?.totalPrice || 0,
          advanceAmount: slot.pricing?.advanceAmount || 0,
          remainingAmount: slot.pricing?.remainingAmount || 0,
        },

        advanceRefund: slot.advanceRefund
          ? {
            refundId: slot.advanceRefund.refundId,
            amount: slot.advanceRefund.amount,
            status: slot.advanceRefund.status,
            initiatedBy: slot.advanceRefund.initiatedBy,
            initiatedByUserId:
              slot.advanceRefund.initiatedByUserId?.toString(),
            createdAt: slot.advanceRefund.createdAt,
            failures: (slot.advanceRefund.failures || []).map((f) => ({
              code: f.code,
              message: f.message,
              stripeEventId: f.stripeEventId,
              occurredAt: f.occurredAt,
            })),
          }
          : undefined,

        remainingPayment: slot.remainingPayment
          ? {
            stripePaymentIntentId:
              slot.remainingPayment.stripePaymentIntentId,
            amount: slot.remainingPayment.amount,
            status: slot.remainingPayment.status,
            paidAt: slot.remainingPayment.paidAt,
            failures: (slot.remainingPayment.failures || []).map((f) => ({
              code: f.code,
              message: f.message,
              type: f.type ?? 'api_error',
              stripeEventId: f.stripeEventId,
              occurredAt: f.occurredAt,
            })),
          }
          : undefined,

        status: slot.status,
      })),

      status: model.status,

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
  async updateSlotAdvanceRefund(
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
  ): Promise<void> {
    await this.model.updateOne(
      {
        paymentId,
        'slots.bookingId': bookingId,
      },
      {
        $set: {
          'slots.$.advanceRefund': {
            refundId: refund.refundId,
            amount: refund.amount,
            status: refund.status,
            initiatedBy: refund.initiatedBy,
            initiatedByUserId: new Types.ObjectId(refund.initiatedByUserId),
            createdAt: refund.createdAt,
            failures: refund.failures,
          },
          'slots.$.status': 'refunded',
        },
      }
    )
  }

  async updateRemainingPaymentByBookingId(
    bookingId: string,
    remainingPayment: {
      stripePaymentIntentId: string
      amount: number
      status: 'paid' | 'failed'
      paidAt: Date
      failures: IBaseFailure[]
    }
  ): Promise<void> {
    await this.model.updateOne(
      { 'slots.bookingId': bookingId },
      {
        $set: {
          'slots.$.remainingPayment': remainingPayment,
          'slots.$.status': 'fully-paid',
          status: 'fully-paid',
        },
      }
    )
  }
  async updateRemainingPaymentByBookingGroupId(
    bookingGroupId: string,
    remainingPayment: {
      stripePaymentIntentId: string
      amount: number
      status: 'paid' | 'failed'
      paidAt: Date
      failures: IBaseFailure[]
    }
  ): Promise<void> {
    await this.model.updateOne(
      { bookingGroupId },
      {
        $set: {
          'slots.$[].remainingPayment': remainingPayment,
          'slots.$[].status': 'fully-paid',
          status: 'fully-paid',
        },
      }
    )
  }

  async findAllPayments(
    page: number,
    limit: number,
    filter: FilterQuery<IPaymentEntity>
  ): Promise<{
    data: IPaymentEntity[]
    currentPage: number
    totalPages: number
    totalCount: number
  }> {
    const skip = (page - 1) * limit
    const totalCount = await this.model.countDocuments(filter)
    const data = await this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('serviceRef', 'name')
      .populate('vendorRef', 'name')
      .populate('customerRef', 'name')
      .lean<any[]>()

    return {
      data: data.map((d) => ({
        ...this.toEntity(d),
        serviceName: d.serviceRef?.name,
        vendorName: d.vendorRef?.name,
        customerName: d.customerRef?.name
      } as any)),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    }
  }
}
