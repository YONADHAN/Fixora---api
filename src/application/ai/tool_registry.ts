import { AIDomain } from '../../shared/types/ai/ai.types'
import { AIToolBundle, AIToolMap, AIToolContext, AIToolProvider } from '../../shared/types/ai/ai.types'
import { getServiceTools } from '../../interfaceAdapters/services/ai_chat_bot/tools/service.tools'
import { getBookingTools } from '../../interfaceAdapters/services/ai_chat_bot/tools/booking.tools'
import { getSubscriptionTools } from '../../interfaceAdapters/services/ai_chat_bot/tools/subscription.tools'
import { getCategoryTools } from '../../interfaceAdapters/services/ai_chat_bot/tools/category.tools'

const TOOL_PROVIDERS: Partial<Record<AIDomain, AIToolProvider>> = {
  SERVICE: getServiceTools,
  BOOKING: getBookingTools,
  SUBSCRIPTION_PLAN: getSubscriptionTools,
  CATEGORY: getCategoryTools,
}

export class ToolRegistry {
  static getToolsForDomains(domains: AIDomain[], context: AIToolContext): AIToolBundle {
    const tools: unknown[] = []
    const toolMap: AIToolMap = {}

    domains.forEach((domain) => {
      const provider = TOOL_PROVIDERS[domain]
      if (provider) {
        const bundle = provider(context)
        tools.push(...bundle.tools)
        Object.assign(toolMap, bundle.toolMap)
      }
    })

    return { tools, toolMap }
  }
}
