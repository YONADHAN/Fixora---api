import { INotificationEntity } from '../../../models/notification_entity'

export interface INotificationRepository {
  findByRecipient(
    recipientId: string,
    page: number,
    limit: number
  ): Promise<{
    data: INotificationEntity[]
    currentPage: number
    totalPages: number
    unreadCount: number
  }>

  markAsRead(notificationId: string): Promise<void>
  markAllAsRead(recipientId: string): Promise<void>
}
