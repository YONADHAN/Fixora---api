import { INotificationEntity } from '../../models/notification_entity'
export interface GetMyNotificationsInput {
  userId: string
  page: number
  limit: number
}

export interface IGetMyNotificationsUseCase {
  execute(data: GetMyNotificationsInput): Promise<GetMyNotificationsResponse>
}

export interface GetMyNotificationsResponse {
  data: INotificationEntity[]
  currentPage: number
  totalPages: number
  unreadCount: number
}
