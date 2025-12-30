import { IMessageEntity } from '../../../models/message_entity'

export interface IMessageRepository {
  createMessage(data: IMessageEntity): Promise<IMessageEntity>

  findMessagesByChatId(
    chatId: string,
    page: number,
    limit: number
  ): Promise<{
    data: IMessageEntity[]
    currentPage: number
    totalPages: number
  }>

  markMessagesAsRead(chatId: string, readerId: string): Promise<void>
}
