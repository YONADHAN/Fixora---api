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

export type SendMessageOutput = IMessageEntity

export interface ISendMessageUseCase {
  execute(input: SendMessageInput): Promise<SendMessageOutput>
}
