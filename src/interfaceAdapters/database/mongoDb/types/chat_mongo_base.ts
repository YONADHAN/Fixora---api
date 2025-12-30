import { Types } from 'mongoose'

export interface ChatMongoBase {
  _id: Types.ObjectId

  chatId: string

  customerId: string
  vendorId: string
  serviceId: string

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
