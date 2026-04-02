import { AIRole } from '../../../shared/types/ai/ai.types'
import { IAskAIChatbotStrategy } from '../../strategies/ai_chatbot/ask_ai_chatbot/ask_ai_chatbot_strategy.interface'

export interface IAskAIChatbotFactory {
  getStrategy(role: AIRole): IAskAIChatbotStrategy
}
