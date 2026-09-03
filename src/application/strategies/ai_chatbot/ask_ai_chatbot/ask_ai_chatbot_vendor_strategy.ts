import { inject, injectable } from 'tsyringe'

import { IAskAIChatbotVendorStrategy } from './ask_ai_chatbot_vendor_strategy.interface'
import {
  AskAIChatbotRequestDTO,
  AskAIChatbotResponseDTO,
} from '../../../dtos/ai_dto'

import { ToolPermissionGuard } from '../../../security/tool_permission.guard'
import { ILLMService } from '../../../../domain/serviceInterfaces/llm_service.interface'
import { AIToolContext } from '../../../../shared/types/ai/ai.types'

@injectable()
export class AskAIChatbotVendorStrategy implements IAskAIChatbotVendorStrategy {
  constructor(
    @inject('ILLMService') private readonly _llmService: ILLMService
  ) { }

  async execute(
    input: AskAIChatbotRequestDTO,
  ): Promise<AskAIChatbotResponseDTO> {
    ToolPermissionGuard.validateMessage(input.message)

    const context: AIToolContext = {
      role: input.role,
      userId: input.userId,
    }

    const history = input.history || []

    const answer = await this._llmService.chat({
      message: input.message,
      history: history,
      role: input.role,
      userId: input.userId,
      domain: 'VENDOR_SUPPORT',
    })

    return {
      reply: answer,
    }
  }
}
