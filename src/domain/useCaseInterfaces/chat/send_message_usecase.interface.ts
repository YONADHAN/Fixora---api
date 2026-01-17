import { IMessageEntity } from '../../models/message_entity'

export interface SendMessageInput {
  chatId: string
  senderId: string

  senderRole: 'customer' | 'vendor'
  content: string
  messageType?: 'text' | 'image' | 'system'
  replyTo?: {
    messageId: string
    content: string
    senderId: string
  }
  booking?: {
    bookingId: string
    bookingDate?: Date
  }
}

import { IChatEntity } from '../../models/chat_entity'

export interface SendMessageOutput {
  message: IMessageEntity
  chat: IChatEntity
}

export interface ISendMessageUseCase {
  execute(input: SendMessageInput): Promise<SendMessageOutput>
}
