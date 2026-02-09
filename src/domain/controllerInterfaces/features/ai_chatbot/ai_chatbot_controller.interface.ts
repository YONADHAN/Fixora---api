import { Request, Response } from 'express'

export interface IAiChatbotController {
  askAIChatbot(req: Request, res: Response): Promise<void>
}
