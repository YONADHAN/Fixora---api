import { Types } from 'mongoose'

export interface BookingMongoBase {
  _id: Types.ObjectId
  bookingId: string
  bookingGroupId: string

  serviceRef: Types.ObjectId
  vendorRef: Types.ObjectId
  customerRef: Types.ObjectId

  date: string
  addressId?: string
  slotStart?: Date
  slotEnd?: Date

  paymentRef?: Types.ObjectId

  paymentStatus:
  | 'pending'
  | 'advance-paid'
  | 'paid'
  | 'fully-paid'
  | 'pending-refund'
  | 'refunded'
  | 'failed'
  serviceStatus: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  stripePaymentIntentId?: string
  stripeSlotPaymentRefundId?: string
  cancelInfo?: {
    cancelledByRole?: 'customer' | 'vendor' | 'admin'
    cancelledByRef?: Types.ObjectId
    reason?: string
    cancelledAt?: Date
  }
  createdAt: Date
  updatedAt: Date
}
