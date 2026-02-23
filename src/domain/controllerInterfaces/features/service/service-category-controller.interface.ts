import { Request, Response } from 'express'

export interface IServiceCategoryController {
  getAllServiceCategories(req: Request, res: Response): Promise<void>
  createServiceCategory(req: Request, res: Response): Promise<void>
  editServiceCategory(req: Request, res: Response): Promise<void>
  blockServiceCategory(req: Request, res: Response): Promise<void>
  getSingleServiceCategory(req: Request, res: Response): Promise<void>
  getActiveServiceCategories(req: Request, res: Response): Promise<void>
}
