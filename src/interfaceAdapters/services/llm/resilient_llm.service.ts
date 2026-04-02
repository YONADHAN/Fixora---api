import { inject, injectable } from 'tsyringe'
import { ILLMService, LLMChatParams } from '../../../domain/serviceInterfaces/llm_service.interface'

@injectable()
export class ResilientLLMService implements ILLMService {
  constructor(
    @inject('GeminiLLMService') private primary: ILLMService,
    @inject('GroqLLMService') private fallback: ILLMService,
  ) { }

  async chat(params: LLMChatParams): Promise<string> {
    try {
      return await this.primary.chat(params)
    } catch (error: any) {
      console.warn('Primary LLM (Gemini) failed. Inspecting for Rate Limit (429)...', error?.status || error?.message)
      if (error?.status === 429 || (error?.message && error.message.includes('429'))) {
        console.warn('429 Rate Limit confirmed. Shifting entirely to Groq (Fallback) for this request!')
        try {
          return await this.fallback.chat(params)
        } catch (fallbackError: any) {
          console.error('Fallback (Groq) also failed:', fallbackError)
          return "I'm sorry, both my primary and backup systems are currently overloaded. Please wait a minute and try again."
        }
      }
      return "I'm encountering an unexpected system error while loading the model. Please try again soon."
    }
  }
}
