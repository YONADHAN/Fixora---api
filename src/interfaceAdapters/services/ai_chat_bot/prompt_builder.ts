import { AIRole, AIDomain } from '../../../shared/types/ai/ai.types'

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
- Access only public data and your own records.
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
    switch (domain) {
      case 'SERVICE':
        return `
Domain: Services
- Answer only service-related questions.
`
      case 'BOOKING':
        return `
Domain: Booking
- Answer only booking-related questions.
`
      default:
        return `
Domain: General
- Answer only general Fixora questions.
`
    }
  }
}
