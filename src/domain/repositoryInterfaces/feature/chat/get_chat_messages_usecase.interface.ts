import { IMessageEntity } from '../../../models/message_entity'

export interface GetChatMessagesInput {
  chatId: string
  requesterId: string
  requesterRole: 'customer' | 'vendor'
  before?: string
  limit?: number
}

export interface GetChatMessagesOutput {
  messages: IMessageEntity[]
  hasMore: boolean
  nextCursor?: string
}

export interface IGetChatMessagesUseCase {
  execute(input: GetChatMessagesInput): Promise<GetChatMessagesOutput>
}
