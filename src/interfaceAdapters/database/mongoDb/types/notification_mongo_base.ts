import { Types } from 'mongoose'

export interface NotificationMongoBase {
  _id: Types.ObjectId

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
    | 'SERVICE_COMPLETED'

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

  createdAt: Date
  updatedAt: Date
}
