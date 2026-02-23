import { inject, injectable } from 'tsyringe'
import { IAskAIChatbotUseCase } from '../../../domain/useCaseInterfaces/ai_chatbot/ask_ai_usecase.interface'
import {
  AskAIChatbotRequestDTO,
  AskAIChatbotResponseDTO,
} from '../../dtos/ai_dto'
import { IAskAIChatbotFactory } from '../../factories/ai_chatbot/ask_ai_chatbot_factory.interface'

@injectable()
export class AskAIChatbotUseCase implements IAskAIChatbotUseCase {
  constructor(
    @inject('IAskAIChatbotFactory')
    private readonly _askAIChatbotFactory: IAskAIChatbotFactory,
  ) {}

  async execute(
    input: AskAIChatbotRequestDTO,
  ): Promise<AskAIChatbotResponseDTO> {
    const strategy = this._askAIChatbotFactory.getStrategy(input.role)
    const response = await strategy.execute(input)
    return response
  }
}
