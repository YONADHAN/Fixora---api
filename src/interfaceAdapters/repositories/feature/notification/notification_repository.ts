import { injectable } from 'tsyringe'
import { FilterQuery } from 'mongoose'

import { BaseRepository } from '../../base_repository'
import {
  NotificationModel,
  INotificationModel,
} from '../../../database/mongoDb/models/notification.model'
import { INotificationRepository } from '../../../../domain/repositoryInterfaces/feature/notification/notification_repository.interface'
import { INotificationEntity } from '../../../../domain/models/notification_entity'
import { NotificationMongoBase } from '../../../database/mongoDb/types/notification_mongo_base'
import { CustomError } from '../../../../domain/utils/custom.error'

@injectable()
export class NotificationRepository
  extends BaseRepository<INotificationModel, INotificationEntity>
  implements INotificationRepository {
  constructor() {
    super(NotificationModel)
  }



  protected toEntity(model: NotificationMongoBase): INotificationEntity {
    return {
      _id: model._id.toString(),

      notificationId: model.notificationId,
      recipientId: model.recipientId,
      recipientRole: model.recipientRole,

      type: model.type,
      title: model.title,
      message: model.message,

      metadata: model.metadata,

      isRead: model.isRead,
      isActive: model.isActive,

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  protected toModel(
    entity: Partial<INotificationEntity>
  ): Partial<INotificationModel> {
    return {
      notificationId: entity.notificationId,
      recipientId: entity.recipientId,
      recipientRole: entity.recipientRole,

      type: entity.type,
      title: entity.title,
      message: entity.message,

      metadata: entity.metadata,

      isRead: entity.isRead ?? false,
      isActive: entity.isActive ?? true,
    }
  }



  async findByRecipient(
    recipientId: string,
    limit: number,
    cursor?: string,
    filterType: 'all' | 'unread' = 'all',
    search?: string
  ): Promise<{
    data: INotificationEntity[]
    nextCursor: string | null
    unreadCount: number
  }> {
    const query: FilterQuery<INotificationModel> = {
      recipientId,
      isActive: true,
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ]
    }

    if (filterType === 'unread') {
      query.isRead = false
    }

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) }
    }

    const notifications = await this.model
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean<NotificationMongoBase[]>()

    const hasNextPage = notifications.length > limit
    const data = hasNextPage ? notifications.slice(0, -1) : notifications
    const lastItem = data[data.length - 1]
    const nextCursor = lastItem ? lastItem.createdAt.toISOString() : null

    const unreadCount = await this.model.countDocuments({
      recipientId,
      isRead: false,
      isActive: true,
    })

    return {
      data: data.map((doc) => this.toEntity(doc)),
      nextCursor: hasNextPage ? nextCursor : null,
      unreadCount,
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    const result = await this.model.updateOne(
      { notificationId },
      { $set: { isRead: true } }
    )

    if (result.matchedCount === 0) {
      throw new CustomError('Notification not found', 404)
    }
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await this.model.updateMany(
      { recipientId, isRead: false },
      { $set: { isRead: true } }
    )
  }
}
