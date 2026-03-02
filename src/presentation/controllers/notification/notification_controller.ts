import 'reflect-metadata'
import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'

import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../../shared/constants'
import { CustomRequest } from '../../middleware/auth_middleware'

import { INotificationController } from '../../../domain/controllerInterfaces/features/notification/notification-controller.interface'
import { IGetMyNotificationsUseCase } from '../../../domain/useCaseInterfaces/notification/get_my_notifications_usecase_interface'
import { IMarkNotificationReadUseCase } from '../../../domain/useCaseInterfaces/notification/mark_notification_read_usecase.interface'
import { IMarkAllNotificationsReadUseCase } from '../../../domain/useCaseInterfaces/notification/mark_all_notifications_read_usecase.interface'
import { ICreateNotificationUseCase } from '../../../domain/useCaseInterfaces/notification/create_notification_usecase_interface'

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject('IGetMyNotificationsUseCase')
    private readonly getMyNotificationsUseCase: IGetMyNotificationsUseCase,

    @inject('IMarkNotificationReadUseCase')
    private readonly markNotificationReadUseCase: IMarkNotificationReadUseCase,

    @inject('IMarkAllNotificationsReadUseCase')
    private readonly markAllNotificationsReadUseCase: IMarkAllNotificationsReadUseCase,

    @inject('ICreateNotificationUseCase')
    private readonly createNotificationUseCase: ICreateNotificationUseCase
  ) { }



  async getMyNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { cursor, limit = 10, filter = 'all', search } = req.query as any
      const user = (req as CustomRequest).user

      const result = await this.getMyNotificationsUseCase.execute({
        userId: user.userId,
        limit: Number(limit),
        cursor: cursor as string,
        filter: filter as 'all' | 'unread',
        search: search as string,
      })

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }



  async markNotificationRead(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params
      const user = (req as CustomRequest).user

      await this.markNotificationReadUseCase.execute(
        notificationId,
        user.userId
      )

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.UPDATED,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }



  async markAllNotificationsRead(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as CustomRequest).user

      await this.markAllNotificationsReadUseCase.execute(user.userId)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.UPDATED,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }


}
