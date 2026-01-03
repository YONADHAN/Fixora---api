import { IMessageEntity } from '../../../models/message_entity'

export interface GetChatMessagesInput {
  chatId: string
  requesterId: string
  requesterRole: 'customer' | 'vendor'
  page?: number
  limit?: number
}

export interface GetChatMessagesOutput {
  messages: IMessageEntity[]
  currentPage: number
  totalPages: number
}

export interface IGetChatMessagesUseCase {
  execute(input: GetChatMessagesInput): Promise<GetChatMessagesOutput>
}
