import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { handleErrorResponse } from '../../../shared/utils/error_handler'

import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from '../../../shared/constants'
import { AIRole } from '../../../shared/types/ai/ai.types'
import { IAiChatbotController } from '../../../domain/controllerInterfaces/features/ai_chatbot/ai_chatbot_controller.interface'
import { IAskAIChatbotUseCase } from '../../../domain/useCaseInterfaces/ai_chatbot/ask_ai_usecase.interface'
import { CustomRequest } from '../../middleware/auth_middleware'

@injectable()
export class AiChatbotController implements IAiChatbotController {
  constructor(
    @inject('IAskAIChatbotUseCase')
    private readonly _askAIChatbotUseCase: IAskAIChatbotUseCase,
  ) { }

  askAIChatbot = async (req: Request, res: Response): Promise<void> => {
    try {
      const { message } = req.body
      if (message.trim().length === 0) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS })
      }
      const user = (req as CustomRequest).user
      const userId = user?.userId || null
      const role = user?.role || 'public'

      const response = await this._askAIChatbotUseCase.execute({
        userId,
        role: role as AIRole,
        message,
      })
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.CHAT_BOT_ANSWERED_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      console.error('AI CHAT ERROR ', error)
      handleErrorResponse(req, res, error)
    }
  }
}
