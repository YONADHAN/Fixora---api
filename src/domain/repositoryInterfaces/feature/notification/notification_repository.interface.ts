import { INotificationEntity } from '../../../models/notification_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface INotificationRepository
  extends IBaseRepository<INotificationEntity> {
  findByRecipient(
    recipientId: string,
    limit: number,
    cursor?: string,
    filterType?: 'all' | 'unread',
    search?: string
  ): Promise<{
    data: INotificationEntity[]
    nextCursor: string | null
    unreadCount: number
  }>

  markAsRead(notificationId: string): Promise<void>
  markAllAsRead(recipientId: string): Promise<void>
}
