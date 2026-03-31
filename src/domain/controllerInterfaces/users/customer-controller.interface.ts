import { Request, Response } from 'express'

export interface ICustomerController {
  logout(req: Request, res: Response): Promise<void>
  profileInfo(req: Request, res: Response): Promise<void>
  profileUpdate(req: Request, res: Response): Promise<void>
  uploadProfileImage(req: Request, res: Response): Promise<void>
  getServiceCategories(req: Request, res: Response): Promise<void>
  getDashboardStats(req: Request, res: Response): Promise<void>
}
