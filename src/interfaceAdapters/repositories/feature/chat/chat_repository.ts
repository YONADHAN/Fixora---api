import { injectable } from 'tsyringe'
import { FilterQuery, Types } from 'mongoose'

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
  implements IChatRepository
{
  constructor() {
    super(ChatModel)
  }

  protected toEntity(model: ChatMongoBase): IChatEntity {
    return {
      _id: model._id.toString(),

      chatId: model.chatId,

      customerRef: (model.customerRef as any)._id
        ? (model.customerRef as any)._id.toString()
        : model.customerRef.toString(),
      vendorRef: (model.vendorRef as any)._id
        ? (model.vendorRef as any)._id.toString()
        : model.vendorRef.toString(),
      serviceRef: (model.serviceRef as any)._id
        ? (model.serviceRef as any)._id.toString()
        : model.serviceRef.toString(),

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

      customerRef: new Types.ObjectId(entity.customerRef),
      vendorRef: new Types.ObjectId(entity.vendorRef),
      serviceRef: new Types.ObjectId(entity.serviceRef),

      lastMessage: entity.lastMessage,

      unreadCount: entity.unreadCount,

      isActive: entity.isActive,
    }
  }

  async findChatByParticipants(
    customerObjectId: string,
    vendorObjectId: string,
    serviceObjectId: string,
  ): Promise<IChatEntity | null> {
    const chat = await this.model
      .findOne({
        customerRef: new Types.ObjectId(customerObjectId),
        vendorRef: new Types.ObjectId(vendorObjectId),
        serviceRef: new Types.ObjectId(serviceObjectId),
      })
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
        }),
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
        $or: [
          { customerRef: new Types.ObjectId(userId) },
          { vendorRef: new Types.ObjectId(userId) },
        ],
      })
      .populate('customerRef', 'name profileImage email userId')
      .populate('vendorRef', 'name profileImage email userId')
      .populate('serviceRef', 'name mainImage')
      .sort({ updatedAt: -1 })
      .lean<ChatMongoBase[]>()

    return chats.map((chat: any) => ({
      ...this.toEntity(chat),
      customer: chat.customerRef,
      vendor: chat.vendorRef,
      service: chat.serviceRef,
      customerRef:
        (chat.customerRef as any)._id?.toString() || chat.customerRef,
      vendorRef: (chat.vendorRef as any)._id?.toString() || chat.vendorRef,
      serviceRef: (chat.serviceRef as any)._id?.toString() || chat.serviceRef,
    }))
  }

  async incrementUnread(
    chatId: string,
    role: 'customer' | 'vendor',
  ): Promise<void> {
    await this.model.updateOne(
      { chatId },
      { $inc: { [`unreadCount.${role}`]: 1 } },
    )
  }

  async resetUnread(
    chatId: string,
    role: 'customer' | 'vendor',
  ): Promise<void> {
    await this.model.updateOne(
      { chatId },
      { $set: { [`unreadCount.${role}`]: 0 } },
    )
  }

  async updateLastMessage(
    chatId: string,
    lastMessage: IChatEntity['lastMessage'],
  ): Promise<void> {
    await this.model.updateOne({ chatId }, { $set: { lastMessage } })
  }

  async deactivateChat(chatId: string): Promise<void> {
    await this.model.updateOne({ chatId }, { $set: { isActive: false } })
  }

  async findByChatId(chatId: string): Promise<IChatEntity | null> {
    const chat = await this.model
      .findOne({ chatId })
      .populate('customerRef', 'name profileImage email userId')
      .populate('vendorRef', 'name profileImage email userId')
      .populate('serviceRef', 'name mainImage')
      .lean<ChatMongoBase | null>()

    if (!chat) return null

    return {
      ...this.toEntity(chat),
      customer: chat.customerRef,
      vendor: chat.vendorRef,
      service: chat.serviceRef,
      customerRef:
        (chat.customerRef as any)._id?.toString() || chat.customerRef,
      vendorRef: (chat.vendorRef as any)._id?.toString() || chat.vendorRef,
      serviceRef: (chat.serviceRef as any)._id?.toString() || chat.serviceRef,
    } as any
  }
}
