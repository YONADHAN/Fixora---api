import { Request, Response } from 'express'
export interface ISubServiceCategoryController {
  createSubServiceCategories(req: Request, res: Response): Promise<void>
  getAllSubServiceCategories(req: Request, res: Response): Promise<void>
  editSubServiceCategory(req: Request, res: Response): Promise<void>
  getSingleSubServiceCategory(req: Request, res: Response): Promise<void>
  toggleBlockStatusOfSubServiceCategory(
    req: Request,
    res: Response
  ): Promise<void>
  toggleVerificationStatusOfSubServiceCategory(
    req: Request,
    res: Response
  ): Promise<void>
}
