import { Request, Response } from 'express'
import { CustomRequestHandler } from '../../shared/types/custom_request'
import {
  blockMyUserMiddleware,
  serviceCategoryController,
} from '../di/resolver'
import { authorizeRole, verifyAuth } from '../middleware/auth_middleware'
import { BaseRoute } from './base_route'

export class ServiceCategoryRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    this.router.use(
      verifyAuth as CustomRequestHandler,
      blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
      authorizeRole(['vendor'])
    )

    this.router
      .route('/category')
      .get((req: Request, res: Response) => {
        // TODO: Get all categories
        serviceCategoryController.getAllServiceCategories(req, res)
      })
      .post((req: Request, res: Response) => {
        // TODO: Create new category
        serviceCategoryController.createServiceCategory(req, res)
      })
      .patch((req: Request, res: Response) => {
        // TODO: Edit category
        serviceCategoryController.editServiceCategory(req, res)
      })

    // Separate route for blocking/unblocking category
    this.router.patch('/category/block', (req: Request, res: Response) => {
      // TODO: Block or unblock category
      ServiceCategoryController.blockServiceCategory(req, res)
    })
  }
}
