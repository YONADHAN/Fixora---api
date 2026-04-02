import { AIDomain, AIRole } from '../../shared/types/ai/ai.types'

export const RoleDomainPolicy: Record<AIRole, AIDomain[]> = {
  customer: ['SERVICE', 'BOOKING', 'CATEGORY', 'SUBSCRIPTION_PLAN', 'GENERAL'],
  vendor: ['SERVICE', 'BOOKING', 'CATEGORY', 'GENERAL'],
  admin: ['SERVICE', 'BOOKING', 'CATEGORY', 'GENERAL'],
  public: ['GENERAL'],
}
