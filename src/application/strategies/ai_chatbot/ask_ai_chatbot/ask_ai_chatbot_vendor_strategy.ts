import { injectable } from 'tsyringe'
import { IAskAIChatbotVendorStrategy } from './ask_ai_chatbot_vendor_strategy.interface'
import {
  AskAIChatbotRequestDTO,
  AskAIChatbotResponseDTO,
} from '../../../dtos/ai_dto'

import { PromptBuilder } from '../../../../interfaceAdapters/services/ai_chat_bot/prompt_builder'
import { ToolPermissionGuard } from '../../../security/tool_permission.guard'
import { getServiceTools } from '../../../../interfaceAdapters/services/ai_chat_bot/tools/service.tools'
import { ROLES } from '../../../../shared/constants'
import { LLMFactory } from '../../../ai/llm_factory'

@injectable()
export class AskAIChatbotVendorStrategy implements IAskAIChatbotVendorStrategy {
  async execute(
    input: AskAIChatbotRequestDTO,
  ): Promise<AskAIChatbotResponseDTO> {

    ToolPermissionGuard.validateMessage(input.message)


    const systemPrompt = PromptBuilder.buildSystemPrompt({
      role: ROLES.VENDOR,
      userId: input.userId,
      domain: 'SERVICE',
    })



    const { tools, toolMap } = getServiceTools()

    const allowedTools = Object.keys(toolMap)


    const llmService = LLMFactory.get()


    const answer = await llmService.chat({
      systemPrompt,
      message: input.message,
      history: input.history,
      tools,
      toolMap: new Proxy(toolMap, {
        get(target, prop: string) {
          ToolPermissionGuard.validateToolCall(prop, allowedTools)
          return target[prop]
        },
      }),
    })

    return {
      reply: answer,
    }
  }
}
