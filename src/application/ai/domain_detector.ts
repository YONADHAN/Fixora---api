import { AIDomain } from '../../shared/types/ai/ai.types'
import { DomainRegistry } from './domain_registry'

export class DomainDetector {
  static detectDomains(message: string): AIDomain[] {
    const text = message.toLowerCase()
    const domains: AIDomain[] = []

    const config = DomainRegistry.getAllConfigurations()
    for (const [domainStr, settings] of Object.entries(config)) {
      const domain = domainStr as AIDomain
      if (settings?.triggerRegex.test(text) && domain !== 'GENERAL') {
        domains.push(domain)
      }
    }

    if (domains.length === 0) {
      domains.push('GENERAL')
    }

    return domains
  }
}
