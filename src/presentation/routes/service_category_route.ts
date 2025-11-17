import { CustomRequestHandler } from '../../shared/types/custom_request'
import { IServiceCategoryController } from 'domain/controllerInterfaces/features/service/service-category-controller.interface'
import { authorizeRole, verifyAuth } from '../middleware/auth_middleware'
import { BaseRoute } from './base_route'
import { handleMulterError } from '../middleware/multer_error_middleware'
import { upload } from '../../interfaceAdapters/config/multer.config'
export class ServiceCategoryRoutes extends BaseRoute {
  constructor(private serviceCategoryController: IServiceCategoryController) {
    super()
  }

  protected initializeRoutes(): void {
    this.router.use(
      verifyAuth as CustomRequestHandler,
      authorizeRole(['admin'])
    )

    /* -----------------------------
       GET ALL + CREATE
    ------------------------------ */
    this.router
      .route('/')
      .get((req, res) =>
        this.serviceCategoryController.getAllServiceCategories(req, res)
      )
      .post(
        handleMulterError(upload.single('ServiceCategoryBannerImage')),
        (req, res) =>
          this.serviceCategoryController.createServiceCategory(req, res)
      )
      .patch(
        handleMulterError(upload.single('ServiceCategoryBannerImage')),
        (req, res) =>
          this.serviceCategoryController.editServiceCategory(req, res)
      )

    /* -----------------------------
       GET SINGLE + EDIT (single ID)
    ------------------------------ */
    this.router
      .route('/:categoryId')
      .get((req, res) =>
        this.serviceCategoryController.getSingleServiceCategory(req, res)
      )

    /* -----------------------------
       BLOCK / UNBLOCK
    ------------------------------ */
    this.router.patch('/block', (req, res) =>
      this.serviceCategoryController.blockServiceCategory(req, res)
    )
  }
}
