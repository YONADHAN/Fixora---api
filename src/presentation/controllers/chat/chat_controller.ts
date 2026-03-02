import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'

import { IGetChatMessagesUseCase } from '../../../domain/repositoryInterfaces/feature/chat/get_chat_messages_usecase.interface'
import { IInitiateChatUseCase } from '../../../domain/useCaseInterfaces/chat/initiate_chat_usecase.interface'
import { IGetUserChatsUseCase } from '../../../domain/useCaseInterfaces/chat/get_user_chats_usecase.interface'

import { CustomRequest } from '../../middleware/auth_middleware'
import { IChatController } from '../../../domain/controllerInterfaces/features/chat/chat-controller.interface'
import { handleErrorResponse } from '../../../shared/utils/error_handler'

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject('IGetChatMessagesUseCase')
    private readonly getChatMessagesUseCase: IGetChatMessagesUseCase,
    @inject('IInitiateChatUseCase')
    private readonly initiateChatUseCase: IInitiateChatUseCase,
    @inject('IGetUserChatsUseCase')
    private readonly getUserChatsUseCase: IGetUserChatsUseCase,
  ) { }

  async getChatMessages(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.params
      const { before, limit = '20' } = req.query

      const user = (req as CustomRequest).user

      const result = await this.getChatMessagesUseCase.execute({
        chatId,
        requesterId: user.userId,
        requesterRole: user.role as 'customer' | 'vendor',
        before: before ? String(before) : undefined,
        limit: Number(limit),
      })

      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      })
    }
  }

  async initiateChat(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.body
      const user = (req as CustomRequest).user

      const chatId = await this.initiateChatUseCase.execute({
        bookingId,
        requesterId: user.userId,
        requesterRole: user.role as 'customer' | 'vendor',
      })

      res.status(201).json({
        success: true,
        message: 'Chat initiated successfully',
        data: { chatId },
      })
    } catch (error) {
      // res.status(error.statusCode || 500).json({
      //   success: false,
      //   message: error.message || 'Internal Server Error',
      // })
      handleErrorResponse(req, res, error)
    }
  }

  async getUserChats(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as CustomRequest).user

      const chats = await this.getUserChatsUseCase.execute(
        user.userId,
        user.role as string,
      )

      res.status(200).json({
        success: true,
        data: chats,
      })
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      })
    }
  }
}
