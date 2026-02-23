export interface IChatEntity {
  _id?: string

  chatId: string

  customerRef: string
  vendorRef: string
  serviceRef: string

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

  createdAt?: Date
  updatedAt?: Date

  //populated fields
  customer?: {
    name: string
    profileImage?: string
    email: string
    userId: string
  }
  vendor?: {
    name: string
    profileImage?: string
    email: string
    userId: string
  }
  service?: {
    name: string
    mainImage?: string
  }
}
