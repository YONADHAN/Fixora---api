import { AIRole } from '../../shared/types/ai/ai.types'
import type { Content } from '@google/generative-ai'
export interface AskAIChatbotRequestDTO {
  userId: string | null
  role: AIRole
  message: string
  history?: Content[]
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
