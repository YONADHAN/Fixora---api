import { AIRole, AIDomain } from '../../../shared/types/ai/ai.types'
import { DomainRegistry } from '../../../application/ai/domain_registry'

export interface PromptContext {
  role: AIRole
  userId?: string | null
  domain: AIDomain
}

export class PromptBuilder {
  static buildSystemPrompt(ctx: PromptContext): string {
    return `
You are Fixora AI Assistant.

${this.roleRules(ctx.role)}
${this.domainRules(ctx.domain)}

General Rules:
- Never hallucinate data.
- Use tools for factual queries only.
- Never perform delete, update, insert, or patch operations.
- If a request is not allowed, politely refuse.
- Respond using Markdown.
- Keep answers concise and clear.
`.trim()
  }

  private static roleRules(role: AIRole): string {
    if (role === 'customer') {
      return `
Role: Customer
- You have secure tool access to the user's personal records and data. 
- You MUST use the provided tools to fetch the user's private/personal data when they ask for it. Do NOT claim you don't have access.
`
    }

    if (role === 'vendor') {
      return `
Role: Vendor
- Access only your own services and bookings.
`
    }

    if (role === 'admin') {
      return `
Role: Admin
- Access all system data.
`
    }

    return `
Role: Public
- Access only public information.
`
  }

  private static domainRules(domain: AIDomain): string {
    const config = DomainRegistry.getConfiguration(domain)
    if (config) {
      return `
Domain: ${config.description}
${config.rules}
`
    }

    const fallback = DomainRegistry.getConfiguration('GENERAL')
    return `
Domain: ${fallback?.description || 'General'}
${fallback?.rules || '- Answer only general Fixora questions.'}
`
  }
}
