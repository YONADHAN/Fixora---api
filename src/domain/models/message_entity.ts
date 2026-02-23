export interface IMessageEntity {
  _id?: string

  messageId: string
  chatId: string

  senderId: string
  senderRole: 'customer' | 'vendor'

  content: string
  messageType: 'text' | 'image' | 'system'

  replyTo?: {
    messageId: string
    content: string
    senderId: string
  }

  booking?: {
    bookingId: string
    bookingDate?: Date
  }

  isRead: boolean

  createdAt?: Date
  updatedAt?: Date
}
