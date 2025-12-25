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
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel)
  }

  /* -------------------- MAPPERS -------------------- */

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

  /* -------------------- CUSTOM METHODS -------------------- */

  async findByRecipient(
    recipientId: string,
    page: number,
    limit: number
  ): Promise<{
    data: INotificationEntity[]
    currentPage: number
    totalPages: number
    unreadCount: number
  }> {
    const skip = (page - 1) * limit

    const filter: FilterQuery<INotificationModel> = {
      recipientId,
      isActive: true,
    }

    const [documents, totalCount, unreadCount] = await Promise.all([
      this.model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean<NotificationMongoBase[]>(),

      this.model.countDocuments(filter),

      this.model.countDocuments({
        recipientId,
        isRead: false,
        isActive: true,
      }),
    ])

    return {
      data: documents.map((doc) => this.toEntity(doc)),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
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
