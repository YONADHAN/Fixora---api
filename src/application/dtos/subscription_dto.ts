import { TRole } from '../../shared/constants'

export interface CreateSubscriptionPlanDTO {
  name: string
  description: string
  price: number
  currency: 'INR'
  interval: 'month' | 'year'

  features: {
    maxServices: number
    videoCallAccess: boolean
    aiChatbotAccess: boolean
  }

  benefits: string[]

  createdByAdminId: string
}

export interface CreateSubscriptionPlanResponseDTO {
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
  isActive: boolean
  createdByAdminId: string

  createdAt?: Date
  updatedAt?: Date
}

export interface SubscriptionPlan {
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
  isActive: boolean
  createdByAdminId: string

  createdAt?: Date
  updatedAt?: Date
}

export interface GetAllSubscriptionPlansRequestDTO {
  page: number
  limit: number
  search?: string
}

export interface GetAllSubscriptionPlansResponseDTO {
  data: SubscriptionPlan[]
  currentPage: number
  totalPages: number
}

export interface ToggleSubscriptionPlanStatusDTO {
  planId: string
}

export interface ToggleSubscriptionPlanStatusResponseDTO {
  planId: string
  isActive: boolean
}

export interface UpdateSubscriptionPlanDTO {
  planId: string
  name?: string
  description?: string
  price?: number
  currency?: string
  features?: {
    maxServices?: number
    videoCallAccess?: boolean
    aiChatbotAccess?: boolean
  }
  benefits?: string[]
}

export interface UpdateSubscriptionPlanResponseDTO extends SubscriptionPlan {}

export interface GetActiveSubscriptionPlansRequestDTO {
  page: number
  limit: number
  search?: string
}

export interface GetActiveSubscriptionPlansResponseDTO {
  data: {
    planId: string
    name: string
    description: string
    price: number
    currency: string
    interval: string
    benefits: string[]
  }[]
  totalPages: number
  currentPage: number
}

export interface CreateSubscriptionCheckoutDTO {
  userId: string
  role: TRole
  planId: string
}
export interface CreateSubscriptionCheckoutStrategyDTO {
  url: string
}
