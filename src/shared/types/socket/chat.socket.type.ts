export interface ChatSendPayload {
  chatId: string
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

export interface SocketAckResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
}
