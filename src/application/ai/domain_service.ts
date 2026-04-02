import { AIDomain, AIRole } from '../../shared/types/ai/ai.types'
import { DomainDetector } from './domain_detector'
import { RoleDomainPolicy } from './role_domain_policy'

export class DomainService {
    static resolveAllowedDomains(message: string, role: AIRole): AIDomain[] {
        const detectedDomains = DomainDetector.detectDomains(message)
        const allowedDomains = RoleDomainPolicy[role]

        const finalDomains = detectedDomains.filter((d) => allowedDomains.includes(d))

        return finalDomains
    }

    static getPrimaryDomain(domains: AIDomain[]): AIDomain {
        return domains.length > 0 ? domains[0] : 'GENERAL'
    }
}
