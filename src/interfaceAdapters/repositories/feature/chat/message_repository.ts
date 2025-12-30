import { injectable } from 'tsyringe'
import { FilterQuery } from 'mongoose'

import { BaseRepository } from '../../base_repository'
import {
  MessageModel,
  IMessageModel,
} from '../../../database/mongoDb/models/message_model'

import { IMessageRepository } from '../../../../domain/repositoryInterfaces/feature/chat/message_repository.interface'
import { IMessageEntity } from '../../../../domain/models/message_entity'
import { MessageMongoBase } from '../../../database/mongoDb/types/message_mongo_base'

@injectable()
export class MessageRepository
  extends BaseRepository<IMessageModel, IMessageEntity>
  implements IMessageRepository
{
  constructor() {
    super(MessageModel)
  }

  /* ----------------------------- MAPPERS ----------------------------- */

  protected toEntity(model: MessageMongoBase): IMessageEntity {
    return {
      _id: model._id.toString(),

      messageId: model.messageId,
      chatId: model.chatId,

      senderId: model.senderId,
      senderRole: model.senderRole,

      content: model.content,
      messageType: model.messageType,

      replyTo: model.replyTo,
      booking: model.booking,

      isRead: model.isRead,

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  protected toModel(entity: Partial<IMessageEntity>): Partial<IMessageModel> {
    return {
      messageId: entity.messageId,
      chatId: entity.chatId,

      senderId: entity.senderId,
      senderRole: entity.senderRole,

      content: entity.content,
      messageType: entity.messageType,

      replyTo: entity.replyTo,
      booking: entity.booking,

      isRead: entity.isRead,
    }
  }

  /* --------------------------- REPOSITORY API -------------------------- */

  async createMessage(data: IMessageEntity): Promise<IMessageEntity> {
    const created = await this.model.create(
      this.toModel({
        ...data,
        isRead: false,
      })
    )

    return this.toEntity(created.toObject() as MessageMongoBase)
  }

  async findMessagesByChatId(
    chatId: string,
    page: number,
    limit: number
  ): Promise<{
    data: IMessageEntity[]
    currentPage: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const filter: FilterQuery<IMessageModel> = { chatId }

    const [documents, totalCount] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean<MessageMongoBase[]>(),

      this.model.countDocuments(filter),
    ])

    return {
      data: documents.map((doc) => this.toEntity(doc)),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    }
  }

  async markMessagesAsRead(chatId: string, readerId: string): Promise<void> {
    await this.model.updateMany(
      {
        chatId,
        senderId: { $ne: readerId },
        isRead: false,
      },
      { $set: { isRead: true } }
    )
  }
}
