import { container } from 'tsyringe'
import { ILLMService } from '../../domain/serviceInterfaces/llm_service.interface'
export class LLMFactory {
  static get(): ILLMService {
    const provider = process.env.AI_PROVIDER || 'GEMINI'

    switch (provider) {
      case 'GEMINI':
        return container.resolve<ILLMService>('GeminiLLMService')
      default:
        return container.resolve<ILLMService>('GeminiLLMService')
    }
  }
}
