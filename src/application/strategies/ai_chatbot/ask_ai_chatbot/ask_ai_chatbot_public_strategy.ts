import { injectable } from 'tsyringe'
import {
    AskAIChatbotRequestDTO,
    AskAIChatbotResponseDTO,
} from '../../../dtos/ai_dto'

import { PromptBuilder } from '../../../../interfaceAdapters/services/ai_chat_bot/prompt_builder'
import { ToolPermissionGuard } from '../../../security/tool_permission.guard'
import { DomainService } from '../../../ai/domain_service'
import { ToolRegistry } from '../../../ai/tool_registry'
import { LLMFactory } from '../../../ai/llm_factory'
import { IAskAIChatbotPublicStrategy } from './ask_ai_chatbot_public_strategy.interface'

@injectable()
export class AskAIChatbotPublicStrategy implements IAskAIChatbotPublicStrategy {
    async execute(
        input: AskAIChatbotRequestDTO,
    ): Promise<AskAIChatbotResponseDTO> {
        ToolPermissionGuard.validateMessage(input.message)

        const finalDomains = DomainService.resolveAllowedDomains(input.message, input.role)

        if (!finalDomains.length) {
            return { reply: 'You are not allowed to access this information.' }
        }

        const primaryDomain = DomainService.getPrimaryDomain(finalDomains)
        const { tools, toolMap } = ToolRegistry.getToolsForDomains(finalDomains, { role: input.role, userId: input.userId })

        const systemPrompt = PromptBuilder.buildSystemPrompt({
            role: input.role,
            userId: input.userId,
            domain: primaryDomain,
        })

        const securedToolMap = ToolPermissionGuard.createSecuredToolMap(toolMap)

        const llm = LLMFactory.get()

        const answer = await llm.chat({
            systemPrompt,
            message: input.message,
            history: input.history,
            tools,
            toolMap: securedToolMap,
        })

        return { reply: answer }
    }
}
