import { injectable } from 'tsyringe'
import { Types } from 'mongoose'

import { BaseRepository } from '../../base_repository'
import {
  ChatModel,
  IChatModel,
} from '../../../database/mongoDb/models/chat_model'

import { IChatRepository } from '../../../../domain/repositoryInterfaces/feature/chat/chat_repository.interface'
import { IChatEntity } from '../../../../domain/models/chat_entity'
import { ChatMongoBase } from '../../../database/mongoDb/types/chat_mongo_base'
import { CustomError } from '../../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../../shared/constants'
type RefType<T> = Types.ObjectId | (T & { _id: Types.ObjectId })

type PopulatedChatDoc = Omit<
  ChatMongoBase,
  'customerRef' | 'vendorRef' | 'serviceRef'
> & {
  customerRef: RefType<{
    name: string
    profileImage?: string
    email: string
    userId: string
  }>
  vendorRef: RefType<{
    name: string
    profileImage?: string
    email: string
    userId: string
  }>
  serviceRef: RefType<{
    name: string
    mainImage?: string
  }>
}

const getRefId = (ref: unknown): string => {
  if (
    ref &&
    typeof ref === 'object' &&
    '_id' in ref &&
    ref._id instanceof Types.ObjectId
  ) {
    return ref._id.toString()
  }
  return String(ref)
}
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

      customerRef: getRefId(model.customerRef),
      vendorRef: getRefId(model.vendorRef),
      serviceRef: getRefId(model.serviceRef),

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
    } catch (error: unknown) {
      const err = error as { code?: number };
      if (err && err.code === 11000) {
        throw new CustomError('Chat already exists', HTTP_STATUS.CONFLICT)
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
      .lean<PopulatedChatDoc[]>()

    return chats.map((chat) => {
      const isCustomerPopulated = chat.customerRef && typeof chat.customerRef === 'object' && 'name' in chat.customerRef;
      const isVendorPopulated = chat.vendorRef && typeof chat.vendorRef === 'object' && 'name' in chat.vendorRef;
      const isServicePopulated = chat.serviceRef && typeof chat.serviceRef === 'object' && 'name' in chat.serviceRef;

      const customerDoc = chat.customerRef as unknown as { name: string; profileImage?: string; email: string; userId: string };
      const vendorDoc = chat.vendorRef as unknown as { name: string; profileImage?: string; email: string; userId: string };
      const serviceDoc = chat.serviceRef as unknown as { name: string; mainImage?: string };

      return {
        ...this.toEntity(chat as unknown as ChatMongoBase),
        customer: isCustomerPopulated ? {
          name: customerDoc.name,
          profileImage: customerDoc.profileImage,
          email: customerDoc.email,
          userId: customerDoc.userId
        } : undefined,
        vendor: isVendorPopulated ? {
          name: vendorDoc.name,
          profileImage: vendorDoc.profileImage,
          email: vendorDoc.email,
          userId: vendorDoc.userId
        } : undefined,
        service: isServicePopulated ? {
          name: serviceDoc.name,
          mainImage: serviceDoc.mainImage
        } : undefined,
        customerRef: getRefId(chat.customerRef),
        vendorRef: getRefId(chat.vendorRef),
        serviceRef: getRefId(chat.serviceRef),
      };
    })
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
      .lean<PopulatedChatDoc | null>()

    if (!chat) return null

    const isCustomerPopulated = chat.customerRef && typeof chat.customerRef === 'object' && 'name' in chat.customerRef;
    const isVendorPopulated = chat.vendorRef && typeof chat.vendorRef === 'object' && 'name' in chat.vendorRef;
    const isServicePopulated = chat.serviceRef && typeof chat.serviceRef === 'object' && 'name' in chat.serviceRef;

    const customerDoc = chat.customerRef as unknown as { name: string; profileImage?: string; email: string; userId: string };
    const vendorDoc = chat.vendorRef as unknown as { name: string; profileImage?: string; email: string; userId: string };
    const serviceDoc = chat.serviceRef as unknown as { name: string; mainImage?: string };

    return {
      ...this.toEntity(chat as unknown as ChatMongoBase),
      customer: isCustomerPopulated ? {
        name: customerDoc.name,
        profileImage: customerDoc.profileImage,
        email: customerDoc.email,
        userId: customerDoc.userId
      } : undefined,
      vendor: isVendorPopulated ? {
        name: vendorDoc.name,
        profileImage: vendorDoc.profileImage,
        email: vendorDoc.email,
        userId: vendorDoc.userId
      } : undefined,
      service: isServicePopulated ? {
        name: serviceDoc.name,
        mainImage: serviceDoc.mainImage
      } : undefined,
      customerRef: getRefId(chat.customerRef),
      vendorRef: getRefId(chat.vendorRef),
      serviceRef: getRefId(chat.serviceRef),
    }
  }
}
