import { Request, Response } from 'express'

export interface IServiceController {
  createService(req: Request, res: Response): Promise<void>
  //getAllServices(req: Request, res: Response): Promise<void>
  // editService(req: Request, res: Response): Promise<void>
  // blockService(req: Request, res: Response): Promise<void>
}
