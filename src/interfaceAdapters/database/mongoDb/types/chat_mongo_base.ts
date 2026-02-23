import { Types } from 'mongoose'

export interface ChatMongoBase {
  _id: Types.ObjectId

  chatId: string

  customerRef: Types.ObjectId
  vendorRef: Types.ObjectId
  serviceRef: Types.ObjectId

  lastMessage?: {
    messageId: string
    content: string
    senderId: string
    senderRole: 'customer' | 'vendor'
    createdAt: Date
  }

  unreadCount: {
    customer: number
    vendor: number
  }

  isActive: boolean

  createdAt: Date
  updatedAt: Date
}
