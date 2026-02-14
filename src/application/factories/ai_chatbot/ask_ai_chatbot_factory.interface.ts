import { TRole } from '../../../shared/constants'
import { IAskAIChatbotStrategy } from '../../strategies/ai_chatbot/ask_ai_chatbot/ask_ai_chatbot_strategy.interface'

export interface IAskAIChatbotFactory {
  getStrategy(role: TRole): IAskAIChatbotStrategy
}
