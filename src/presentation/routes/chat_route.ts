import { CustomRequestHandler } from '../../shared/types/custom_request'

import { authorizeRole, verifyAuth } from '../middleware/auth_middleware'

import { BaseRoute } from './base_route'

import { Request, Response } from 'express'
import { blockMyUserMiddleware, chatController } from '../di/resolver'

export class ChatRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    this.router.get(
      '/:chatId/messages',
      verifyAuth,
      authorizeRole(['customer', 'vendor']),
      blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
      (req: Request, res: Response) => {
        chatController.getChatMessages(req, res)
      }
    )

    this.router.post(
      '/initiate',
      verifyAuth,
      authorizeRole(['customer', 'vendor']),
      blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
      (req: Request, res: Response) => {
        chatController.initiateChat(req, res)
      }
    )

    this.router.get(
      '/',
      verifyAuth,
      authorizeRole(['customer', 'vendor']),
      blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
      (req: Request, res: Response) => {
        chatController.getUserChats(req, res)
      }
    )
  }
}
