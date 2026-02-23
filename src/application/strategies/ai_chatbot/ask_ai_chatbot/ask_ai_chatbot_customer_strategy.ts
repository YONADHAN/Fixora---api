import { injectable } from 'tsyringe'
import {
  AskAIChatbotRequestDTO,
  AskAIChatbotResponseDTO,
} from '../../../dtos/ai_dto'

import { PromptBuilder } from '../../../../interfaceAdapters/services/ai_chat_bot/prompt_builder'
import { ToolPermissionGuard } from '../../../security/tool_permission.guard'
import { detectDomains } from '../../../ai/domain_detector'
import { RoleDomainPolicy } from '../../../ai/role_domain_policy'
import { getToolsForDomains } from '../../../ai/tool_registry'
import { LLMFactory } from '../../../ai/llm_factory'
import { IAskAIChatbotCustomerStrategy } from './ask_ai_chatbot_customer_strategy.interface'

@injectable()
export class AskAIChatbotCustomerStrategy implements IAskAIChatbotCustomerStrategy {
  async execute(
    input: AskAIChatbotRequestDTO,
  ): Promise<AskAIChatbotResponseDTO> {
    ToolPermissionGuard.validateMessage(input.message)

    const domains = detectDomains(input.message)

    const allowedDomains = RoleDomainPolicy[input.role]
    const finalDomains = domains.filter((d) => allowedDomains.includes(d))

    if (!finalDomains.length) {
      return { reply: 'You are not allowed to access this information.' }
    }

    const { tools, toolMap } = getToolsForDomains(finalDomains)

    const systemPrompt = PromptBuilder.buildSystemPrompt({
      role: input.role,
      userId: input.userId,
      domain: finalDomains[0],
    })

    const llm = LLMFactory.get()

    const answer = await llm.chat({
      systemPrompt,
      message: input.message,
      history: input.history,
      tools,
      toolMap: new Proxy(toolMap, {
        get(target, prop: string) {
          if (!(prop in target)) {
            throw new Error(`Tool ${String(prop)} not allowed`)
          }
          return target[prop]
        },
      }),
    })

    return { reply: answer }
  }
}
