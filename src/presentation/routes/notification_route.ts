import { BaseRoute } from './base_route'
import { Request, Response } from 'express'
import { verifyAuth } from '../middleware/auth_middleware'
import { notificationController } from '../di/resolver'

export class NotificationRoutes extends BaseRoute {
  protected initializeRoutes(): void {
    this.router.get('/', verifyAuth, (req: Request, res: Response) =>
      notificationController.getMyNotifications(req, res)
    )

    // this.router.post('/test', verifyAuth, (req: Request, res: Response) =>
    //   notificationController.testNotification(req, res)
    // )

    this.router.patch(
      '/:notificationId/read',
      verifyAuth,
      (req: Request, res: Response) =>
        notificationController.markNotificationRead(req, res)
    )

    this.router.patch('/read-all', verifyAuth, (req: Request, res: Response) =>
      notificationController.markAllNotificationsRead(req, res)
    )
  }
}
