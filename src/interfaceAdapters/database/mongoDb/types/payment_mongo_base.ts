import { Types } from 'mongoose'

export interface PaymentMongoBase {
  _id: Types.ObjectId

  paymentId: string
  bookingGroupId: string

  customerRef: Types.ObjectId
  vendorRef: Types.ObjectId
  serviceRef: Types.ObjectId

  advancePayment: {
    stripePaymentIntentId: string
    amount: number
    currency: 'INR'
    status: 'pending' | 'paid' | 'failed'
    paidAt?: Date
    failures: {
      code?: string
      message?: string
      type?: 'card_error' | 'api_error' | 'validation_error'
      stripeEventId?: string
      occurredAt: Date
    }[]
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
      status: 'pending' | 'succeeded' | 'failed'
      initiatedBy: 'customer' | 'vendor' | 'admin'
      initiatedByUserId: Types.ObjectId
      createdAt: Date
      failures: {
        code?: string
        message?: string
        stripeEventId?: string
        occurredAt: Date
      }[]
    }

    remainingPayment?: {
      stripePaymentIntentId: string
      amount: number
      status: 'pending' | 'paid' | 'failed'
      paidAt?: Date
      failures: {
        code?: string
        message?: string
        type?: 'card_error' | 'api_error'
        stripeEventId?: string
        occurredAt: Date
      }[]
    }

    status:
      | 'advance-paid'
      | 'advance-refunded'
      | 'remaining-pending'
      | 'fully-paid'
      | 'cancelled'
  }[]

  status:
    | 'advance-paid'
    | 'partially-refunded'
    | 'refunded'
    | 'partially-paid'
    | 'fully-paid'

  createdAt: Date
  updatedAt: Date
}
