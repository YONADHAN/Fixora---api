import { Request, Response } from 'express'

export interface IChatController {
  getChatMessages(req: Request, res: Response): Promise<void>
  initiateChat(req: Request, res: Response): Promise<void>
  getUserChats(req: Request, res: Response): Promise<void>
}
