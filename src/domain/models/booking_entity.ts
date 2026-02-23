export interface IBookingEntity {
  _id?: string

  bookingId: string
  bookingGroupId: string

  serviceRef: string
  serviceName?: string
  serviceId?: string
  mainImage?: string
  vendorRef: string
  customerRef: string

  date: string
  addressId?: string
  slotStart?: Date
  slotEnd?: Date

  paymentRef?: string

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
    cancelledByRef?: string
    reason?: string
    cancelledAt?: Date
  }

  createdAt?: Date
  updatedAt?: Date

  slots?: IBookingEntity[]
}
