import { container } from 'tsyringe'
import { DashboardEventsService } from '../services/dashboard_events.service'
import { GeminiLLMService } from '../../interfaceAdapters/services/llm/gemini_llm.service'
import { GroqLLMService } from '../../interfaceAdapters/services/llm/groq_llm.service'
import { ResilientLLMService } from '../../interfaceAdapters/services/llm/resilient_llm.service'
import { ILLMService } from '../../domain/serviceInterfaces/llm_service.interface'

export class ServicesRegistry {
  static registerServices(): void {
    container.register('IDashboardEventsService', {
      useClass: DashboardEventsService,
    })
    container.register<ILLMService>('GeminiLLMService', {
      useClass: GeminiLLMService,
    })
    container.register<ILLMService>('GroqLLMService', {
      useClass: GroqLLMService,
    })
    container.register<ILLMService>('ILLMService', {
      useClass: ResilientLLMService,
    })
  }
}
