export interface INotificationEntity {
  _id?: string

  notificationId: string
  recipientId: string
  recipientRole: 'customer' | 'vendor' | 'admin'

  type:
    | 'BOOKING_CREATED'
    | 'BOOKING_CANCELLED'
    | 'BOOKING_CONFIRMED'
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_FAILED'
    | 'ADMIN_MESSAGE'
    | 'VENDOR_DOCUMENTS_SUBMITTED'
    | 'SUBSCRIPTION'

  title: string
  message: string

  metadata?: {
    bookingId?: string
    serviceId?: string
    paymentId?: string
    redirectUrl?: string
    vendorRef?: string
  }

  isRead: boolean
  isActive: boolean

  createdAt?: Date
  updatedAt?: Date
}
