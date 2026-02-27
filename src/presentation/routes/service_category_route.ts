import { CustomRequestHandler } from '../../shared/types/custom_request'
import { serviceCategoryController } from '../di/resolver'
import { authorizeRole, verifyAuth } from '../middleware/auth_middleware'
import { BaseRoute } from './base_route'
import { handleMulterError } from '../middleware/multer_error_middleware'
import { upload } from '../../interfaceAdapters/config/multer.config'
export class ServiceCategoryRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    this.router.use(
      verifyAuth as CustomRequestHandler,
      authorizeRole(['admin'])
    )

   
    this.router
      .route('/')
      .get((req, res) =>
        serviceCategoryController.getAllServiceCategories(req, res)
      )
      .post(
        handleMulterError(upload.single('ServiceCategoryBannerImage')),
        (req, res) => serviceCategoryController.createServiceCategory(req, res)
      )
      .patch(
        handleMulterError(upload.single('ServiceCategoryBannerImage')),
        (req, res) => serviceCategoryController.editServiceCategory(req, res)
      )

    this.router.patch('/block', (req, res) =>
      serviceCategoryController.blockServiceCategory(req, res)
    )

    this.router
      .route('/:categoryId')
      .get((req, res) =>
        serviceCategoryController.getSingleServiceCategory(req, res)
      )
      .patch(handleMulterError(upload.single('bannerImage')), (req, res) => {
        serviceCategoryController.editServiceCategory(req, res)
      })
  }
}
