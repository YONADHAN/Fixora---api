import { INotificationEntity } from '../../models/notification_entity'
export interface GetMyNotificationsInput {
  userId: string
  limit: number
  cursor?: string
  filter?: 'all' | 'unread'
  search?: string
}

export interface IGetMyNotificationsUseCase {
  execute(data: GetMyNotificationsInput): Promise<GetMyNotificationsResponse>
}

export interface GetMyNotificationsResponse {
  data: INotificationEntity[]
  nextCursor: string | null
  unreadCount: number
}
