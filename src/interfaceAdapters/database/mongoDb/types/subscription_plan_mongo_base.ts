import { Types } from 'mongoose'

export interface SubscriptionPlanMongoBase {
  _id: Types.ObjectId

  planId: string
  name: string
  description: string

  price: number
  currency: string
  durationInDays: number

  stripeProductId: string
  stripePriceId: string

  features: {
    maxServices?: number
    videoCallAccess?: boolean
    aiChatbotAccess?: boolean
  }
  benefits: string[]
  isActive: boolean
  createdByAdminId: string

  createdAt: Date
  updatedAt: Date
}
