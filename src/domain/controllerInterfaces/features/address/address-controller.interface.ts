import { Request, Response } from 'express'

export interface IAddressController {
  getAddress(req: Request, res: Response): Promise<void>
  addAddress(req: Request, res: Response): Promise<void>
  editAddress(req: Request, res: Response): Promise<void>
  setDefaultAddress(req: Request, res: Response): Promise<void>
  deleteAddress(req: Request, res: Response): Promise<void>
  getSingleAddress(req: Request, res: Response): Promise<void>
}
