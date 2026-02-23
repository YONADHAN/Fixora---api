import { AIDomain } from '../../shared/types/ai/ai.types'

export function detectDomains(message: string): AIDomain[] {
  const text = message.toLowerCase()
  const domains: AIDomain[] = []

  if (/(service|facial|hair|makeup|spa)/.test(text)) {
    domains.push('SERVICE')
  }

  if (/(booking|appointment|schedule|reschedule)/.test(text)) {
    domains.push('BOOKING')
  }

  if (/(category|type|kind)/.test(text)) {
    domains.push('CATEGORY')
  }

  if (/(subscription|plan|subscribe)/.test(text)) {
    domains.push('SUBSCRIPTION_PLAN')
  }

  if (domains.length === 0) {
    domains.push('GENERAL')
  }

  return domains
}
