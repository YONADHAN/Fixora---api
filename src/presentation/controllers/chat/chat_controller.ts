import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'

import { IGetChatMessagesUseCase } from '../../../domain/repositoryInterfaces/feature/chat/get_chat_messages_usecase.interface'
import { IInitiateChatUseCase } from '../../../domain/useCaseInterfaces/chat/initiate_chat_usecase.interface'
import { IGetUserChatsUseCase } from '../../../domain/useCaseInterfaces/chat/get_user_chats_usecase.interface'

import { CustomRequest } from '../../middleware/auth_middleware'
import { IChatController } from '../../../domain/controllerInterfaces/features/chat/chat-controller.interface'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../shared/constants'
import { IStorageService } from '../../../domain/serviceInterfaces/s3_storage_service_interface'
import { config } from '../../../shared/config'

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject('IGetChatMessagesUseCase')
    private readonly getChatMessagesUseCase: IGetChatMessagesUseCase,
    @inject('IInitiateChatUseCase')
    private readonly initiateChatUseCase: IInitiateChatUseCase,
    @inject('IGetUserChatsUseCase')
    private readonly getUserChatsUseCase: IGetUserChatsUseCase,
    @inject('IStorageService')
    private readonly storageService: IStorageService,
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

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      })
    } catch (error: unknown) {
      handleErrorResponse(req,res,error)
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

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.CHAT_INITIATED_SUCCESSFULLY,
        data: { chatId },
      })
    } catch (error) {
    
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

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: chats,
      })
    } catch (error: unknown) {
      handleErrorResponse(req,res,error)
    }
  }

  async uploadChatFile(req: Request, res: Response): Promise<void> {
   
    try {
      const file = req.file as Express.Multer.File

      if (!file) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.NO_FILE_UPLOADED,
        })
        return
      }

      const bucketName = config.storageConfig.bucket!
      const folder = 'chat-files'

      const uploadedFileUrl = await this.storageService.uploadFile(
        bucketName,
        file,
        folder
      )

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.FILE_UPLOADED_SUCCESSFULLY,
        data: {
          fileUrl: uploadedFileUrl,
        },
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
