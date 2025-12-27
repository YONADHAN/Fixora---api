import { INotificationEntity } from '../../models/notification_entity'

export interface CreateNotificationInput {
  recipientId: string
  recipientRole: 'customer' | 'vendor' | 'admin'

  type:
    | 'BOOKING_CREATED'
    | 'BOOKING_CANCELLED'
    | 'BOOKING_CONFIRMED'
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_FAILED'
    | 'ADMIN_MESSAGE'

  title: string
  message: string

  metadata?: {
    bookingId?: string
    serviceId?: string
    paymentId?: string
    redirectUrl?: string
  }
}

export interface ICreateNotificationUseCase {
  execute(data: CreateNotificationInput): Promise<INotificationEntity>
}
