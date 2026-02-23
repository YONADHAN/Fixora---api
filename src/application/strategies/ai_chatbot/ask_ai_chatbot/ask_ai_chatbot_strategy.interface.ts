import {
  AskAIChatbotRequestDTO,
  AskAIChatbotResponseDTO,
} from '../../../dtos/ai_dto'

export interface IAskAIChatbotStrategy {
  execute(input: AskAIChatbotRequestDTO): Promise<AskAIChatbotResponseDTO>
}
