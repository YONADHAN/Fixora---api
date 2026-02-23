import { AIDomain } from '../../shared/types/ai/ai.types'
import { AIToolBundle, AIToolMap } from '../../shared/types/ai/ai.types'
import { getServiceTools } from '../../interfaceAdapters/services/ai_chat_bot/tools/service.tools'
// later:
// import { getBookingTools } from ...

export function getToolsForDomains(domains: AIDomain[]): AIToolBundle {
  const tools: unknown[] = []
  const toolMap: AIToolMap = {}

  if (domains.includes('SERVICE')) {
    const bundle = getServiceTools()
    tools.push(...bundle.tools)
    Object.assign(toolMap, bundle.toolMap)
  }

  // future:
  // if (domains.includes('BOOKING')) { ... }

  return { tools, toolMap }
}
