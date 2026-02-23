import { Request, Response } from 'express'

export interface IServiceController {
  createService(req: Request, res: Response): Promise<void>
  getAllServices(req: Request, res: Response): Promise<void>
  getServiceById(req: Request, res: Response): Promise<void>
  editService(req: Request, res: Response): Promise<void>
  toggleServiceBlock(req: Request, res: Response): Promise<void>
  searchServicesForCustomer(req: Request, res: Response): Promise<void>
}
