import {
  AskAIChatbotRequestDTO,
  AskAIChatbotResponseDTO,
} from '../../../application/dtos/ai_dto'

export interface IAskAIChatbotUseCase {
  execute(input: AskAIChatbotRequestDTO): Promise<AskAIChatbotResponseDTO>
}
