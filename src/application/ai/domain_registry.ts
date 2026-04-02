import { AIDomain } from '../../shared/types/ai/ai.types'

export interface DomainConfig {
    triggerRegex: RegExp
    description: string
    rules: string
}

export class DomainRegistry {
    private static configurations: Partial<Record<AIDomain, DomainConfig>> = {
        SERVICE: {
            triggerRegex: /\b(service|facial|hair|makeup|spa)\b/i,
            description: 'Services',
            rules: '- Answer only service-related questions.',
        },
        BOOKING: {
            triggerRegex: /\b(booking|appointment|schedule|reschedule)\b/i,
            description: 'Booking',
            rules: '- Answer only booking-related questions.',
        },
        CATEGORY: {
            triggerRegex: /\b(category|type|kind)\b/i,
            description: 'Category',
            rules: '- Answer only category-related questions.',
        },
        SUBSCRIPTION_PLAN: {
            triggerRegex: /\b(subscription|plan|subscribe)\b/i,
            description: 'Subscription Plan',
            rules: '- Answer only subscription-related questions.',
        },
        GENERAL: {
            triggerRegex: /$.^/,
            description: 'General',
            rules: '- Answer only general Fixora questions.',
        },
    }

    static getAllConfigurations(): Partial<Record<AIDomain, DomainConfig>> {
        return this.configurations
    }

    static getConfiguration(domain: AIDomain): DomainConfig | undefined {
        return this.configurations[domain]
    }
}
