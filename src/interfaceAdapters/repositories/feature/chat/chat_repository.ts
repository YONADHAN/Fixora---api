import { injectable } from 'tsyringe'
import { FilterQuery } from 'mongoose'

import { BaseRepository } from '../../base_repository'
import {
  ChatModel,
  IChatModel,
} from '../../../database/mongoDb/models/chat_model'

import { IChatRepository } from '../../../../domain/repositoryInterfaces/feature/chat/chat_repository.interface'
import { IChatEntity } from '../../../../domain/models/chat_entity'
import { ChatMongoBase } from '../../../database/mongoDb/types/chat_mongo_base'
import { CustomError } from '../../../../domain/utils/custom.error'

@injectable()
export class ChatRepository
  extends BaseRepository<IChatModel, IChatEntity>
  implements IChatRepository {
  constructor() {
    super(ChatModel)
  }

  protected toEntity(model: ChatMongoBase): IChatEntity {
    return {
      _id: model._id.toString(),

      chatId: model.chatId,

      customerId: model.customerId,
      vendorId: model.vendorId,
      serviceId: model.serviceId,

      lastMessage: model.lastMessage,

      unreadCount: model.unreadCount,

      isActive: model.isActive,

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  protected toModel(entity: Partial<IChatEntity>): Partial<IChatModel> {
    return {
      chatId: entity.chatId,

      customerId: entity.customerId,
      vendorId: entity.vendorId,
      serviceId: entity.serviceId,

      lastMessage: entity.lastMessage,

      unreadCount: entity.unreadCount,

      isActive: entity.isActive,
    }
  }

  async findChatByParticipants(
    customerId: string,
    vendorId: string,
    serviceId: string
  ): Promise<IChatEntity | null> {
    const chat = await this.model
      .findOne({ customerId, vendorId, serviceId })
      .lean<ChatMongoBase | null>()

    return chat ? this.toEntity(chat) : null
  }

  async createChat(data: IChatEntity): Promise<IChatEntity> {
    try {
      const created = await this.model.create(
        this.toModel({
          ...data,
          unreadCount: data.unreadCount ?? {
            customer: 0,
            vendor: 0,
          },
          isActive: true,
        })
      )

      return this.toEntity(created.toObject() as ChatMongoBase)
    } catch (error: any) {
      if (error.code === 11000) {
        throw new CustomError('Chat already exists', 409)
      }
      throw error
    }
  }

  async getUserChats(userId: string): Promise<IChatEntity[]> {
    const chats = await this.model
      .find({
        $or: [{ customerId: userId }, { vendorId: userId }],
      })
      .sort({ updatedAt: -1 })
      .lean<ChatMongoBase[]>()

    return chats.map((chat) => this.toEntity(chat))
  }

  async incrementUnread(
    chatId: string,
    role: 'customer' | 'vendor'
  ): Promise<void> {
    await this.model.updateOne(
      { chatId },
      { $inc: { [`unreadCount.${role}`]: 1 } }
    )
  }

  async resetUnread(
    chatId: string,
    role: 'customer' | 'vendor'
  ): Promise<void> {
    await this.model.updateOne(
      { chatId },
      { $set: { [`unreadCount.${role}`]: 0 } }
    )
  }

  async updateLastMessage(
    chatId: string,
    lastMessage: IChatEntity['lastMessage']
  ): Promise<void> {
    await this.model.updateOne({ chatId }, { $set: { lastMessage } })
  }

  async deactivateChat(chatId: string): Promise<void> {
    await this.model.updateOne({ chatId }, { $set: { isActive: false } })
  }

  async findByChatId(chatId: string): Promise<IChatEntity | null> {
    const chat = await this.model
      .findOne({ chatId })
      .lean<ChatMongoBase | null>()

    return chat ? this.toEntity(chat) : null
  }
}
