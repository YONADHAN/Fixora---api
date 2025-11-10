import { Request, Response } from 'express'

export interface IAdminController {
  logout(req: Request, res: Response): Promise<void>
  getAllCustomers(req: Request, res: Response): Promise<void>
  getAllVendors(req: Request, res: Response): Promise<void>
  changeMyUserBlockStatus(req: Request, res: Response): Promise<void> // ------any
  getAllVendorRequests(req: Request, res: Response): Promise<void>
  changeMyVendorVerificationStatus(req: Request, res: Response): Promise<void>
}
