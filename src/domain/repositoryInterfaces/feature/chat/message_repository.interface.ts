import { IMessageEntity } from '../../../models/message_entity'

export interface IMessageRepository {
  createMessage(data: IMessageEntity): Promise<IMessageEntity>

  findMessagesByChatId(
    chatId: string,
    before?: Date,
    limit?: number,
  ): Promise<{
    messages: IMessageEntity[]
    hasMore: boolean
    nextCursor?: string
  }>

  markMessagesAsRead(chatId: string, readerId: string): Promise<void>
}
