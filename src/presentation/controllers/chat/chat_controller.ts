import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'

import { IGetChatMessagesUseCase } from '../../../domain/repositoryInterfaces/feature/chat/get_chat_messages_usecase.interface'
import { IInitiateChatUseCase } from '../../../domain/useCaseInterfaces/chat/initiate_chat_usecase.interface'
import { IGetUserChatsUseCase } from '../../../domain/useCaseInterfaces/chat/get_user_chats_usecase.interface'

import { CustomRequest } from '../../middleware/auth_middleware'
import { IChatController } from '../../../domain/controllerInterfaces/features/chat/chat-controller.interface'

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject('IGetChatMessagesUseCase')
    private readonly getChatMessagesUseCase: IGetChatMessagesUseCase,
    @inject('IInitiateChatUseCase')
    private readonly initiateChatUseCase: IInitiateChatUseCase,
    @inject('IGetUserChatsUseCase')
    private readonly getUserChatsUseCase: IGetUserChatsUseCase
  ) { }

  async getChatMessages(req: Request, res: Response): Promise<void> {
    const { chatId } = req.params
    const { page = '1', limit = '20' } = req.query

    const user = (req as CustomRequest).user

    const result = await this.getChatMessagesUseCase.execute({
      chatId,
      requesterId: user.userId,
      requesterRole: user.role as 'customer' | 'vendor',
      page: Number(page),
      limit: Number(limit),
    })

    res.status(200).json({
      success: true,
      data: result,
    })
  }

  async initiateChat(req: Request, res: Response): Promise<void> {
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
  }

  async getUserChats(req: Request, res: Response): Promise<void> {
    const user = (req as CustomRequest).user

    const chats = await this.getUserChatsUseCase.execute(user.userId)

    res.status(200).json({
      success: true,
      data: chats,
    })
  }
}
