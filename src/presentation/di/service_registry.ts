import { container } from 'tsyringe'
import { DashboardEventsService } from '../services/dashboard_events.service'
import { GroqLLMService } from '../../interfaceAdapters/services/ai_chat_bot/groq_llm.service'
import { ILLMService } from '../../domain/serviceInterfaces/llm_service.interface'
import { ICodeGeneratorService } from '../../domain/serviceInterfaces/counter_service_interface'
import { CodeGeneratorService } from '../../application/service/code_generator_service'

export class ServicesRegistry {
  static registerServices(): void {
    container.register('IDashboardEventsService', {
      useClass: DashboardEventsService,
    })
    container.register<ILLMService>('GroqLLMService', {
      useClass: GroqLLMService,
    })
    container.register<ILLMService>('ILLMService', {
      useClass: GroqLLMService,
    })
    container.register<ICodeGeneratorService>('ICodeGeneratorService',{
      useClass: CodeGeneratorService,
    })
  }
}
