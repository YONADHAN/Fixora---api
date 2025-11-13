import { Request, Response } from 'express'

export interface IServiceController {
  getAllServices(req: Request, res: Response): Promise<void>
  createService(req: Request, res: Response): Promise<void>
  editService(req: Request, res: Response): Promise<void>
  blockService(req: Request, res: Response): Promise<void>
}
