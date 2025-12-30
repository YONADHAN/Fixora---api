import { IChatEntity } from '../../../models/chat_entity'

export interface IChatRepository {
  createChat(data: IChatEntity): Promise<IChatEntity>

  findChatByParticipants(
    customerId: string,
    vendorId: string,
    serviceId: string
  ): Promise<IChatEntity | null>

  findMyChats(
    userId: string,
    role: 'customer' | 'vendor'
  ): Promise<IChatEntity[]>

  incrementUnread(chatId: string, role: 'customer' | 'vendor'): Promise<void>

  resetUnread(chatId: string, role: 'customer' | 'vendor'): Promise<void>

  updateLastMessage(
    chatId: string,
    lastMessage: IChatEntity['lastMessage']
  ): Promise<void>

  deactivateChat(chatId: string): Promise<void>
}
