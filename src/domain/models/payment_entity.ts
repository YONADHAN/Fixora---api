import {
  TRole,
  TCurrency,
  TAdvancePaymentStatus,
  TRemainingPaymentStatus,
  TRefundStatus,
  TSlotPaymentStatus,
  TPaymentStatus,
} from '../../shared/constants'
export interface IBaseFailure {
  code?: string
  message?: string
  stripeEventId?: string
  occurredAt: Date
}

export interface IPaymentIntentFailure extends IBaseFailure {
  type: 'card_error' | 'api_error'
}
export interface IPaymentEntity {
  _id?: string

  paymentId: string
  bookingGroupId: string
  customerRef: string
  vendorRef: string
  serviceRef: string

  advancePayment: {
    stripePaymentIntentId: string
    amount: number
    currency: TCurrency
    status: TAdvancePaymentStatus
    paidAt?: Date
    failures: IPaymentIntentFailure[]
  }

  slots: {
    bookingId: string

    pricing: {
      totalPrice: number
      advanceAmount: number
      remainingAmount: number
    }

    advanceRefund?: {
      refundId: string
      amount: number
      status: TRefundStatus
      initiatedBy: TRole
      initiatedByUserId: string
      createdAt: Date
      failures: IBaseFailure[]
    }

    remainingPayment?: {
      stripePaymentIntentId: string
      amount: number
      status: TRemainingPaymentStatus
      paidAt?: Date
      failures: IPaymentIntentFailure[]
    }

    status: TSlotPaymentStatus
  }[]

  status: TPaymentStatus

  createdAt?: Date
  updatedAt?: Date
}
