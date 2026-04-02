import { Request, Response } from 'express'
import { optionalVerifyAuth } from '../middleware/auth_middleware'
import { BaseRoute } from './base_route'
import { aiChatbotController } from '../di/resolver'

export class AiChatbotRoute extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    this.router.post(
      '/',
      optionalVerifyAuth,
      (req: Request, res: Response) => {
        aiChatbotController.askAIChatbot(req, res)
      },
    )
  }
}
