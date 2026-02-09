import { TRole } from '../../shared/constants'
import { AIDomain } from '../../shared/types/ai/ai.types'

export const RoleDomainPolicy: Record<TRole, AIDomain[]> = {
  customer: ['SERVICE', 'BOOKING', 'CATEGORY', 'SUBSCRIPTION_PLAN', 'GENERAL'],
  vendor: ['SERVICE', 'BOOKING', 'CATEGORY', 'GENERAL'],
  admin: ['SERVICE', 'BOOKING', 'CATEGORY', 'GENERAL'],
}
