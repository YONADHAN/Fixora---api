import { TRole } from '../../shared/constants'

export interface AskAIChatbotRequestDTO {
  userId: string | null
  role: TRole
  message: string
  history?: any[]
}

export interface AskAIChatbotResponseDTO {
  reply: string
}

export interface SubscriptionPlanAIDTO {
  planId: string
  name: string
  description: string
  price: number
  currency: string
  durationInDays: number
  features: {
    maxServices?: number
    videoCallAccess?: boolean
    aiChatbotAccess?: boolean
  }
  benefits: string[]
}
