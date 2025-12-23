export interface IBookingEntity {
  _id?: string

  bookingId: string
  bookingGroupId: string

  serviceRef: string
  vendorRef: string
  customerRef: string

  date: string
  slotStart?: Date
  slotEnd?: Date

  paymentRef?: string

  paymentStatus:
    | 'pending'
    | 'advance-paid'
    | 'paid'
    | 'pending-refund'
    | 'refunded'
    | 'failed'
  serviceStatus: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  stripePaymentIntentId?: string
  stripeSlotPaymentRefundId?: string
  cancelInfo?: {
    cancelledByRole?: 'customer' | 'vendor' | 'admin'
    cancelledByRef?: string
    reason?: string
    cancelledAt?: Date
  }

  createdAt?: Date
  updatedAt?: Date
}
