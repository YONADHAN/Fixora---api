import { Request, Response } from 'express'

export interface INotificationController {
  getMyNotifications(req: Request, res: Response): Promise<void>
  markNotificationRead(req: Request, res: Response): Promise<void>
  markAllNotificationsRead(req: Request, res: Response): Promise<void>
  //------------------for testing
  testNotification(req: Request, res: Response): Promise<void>
}
