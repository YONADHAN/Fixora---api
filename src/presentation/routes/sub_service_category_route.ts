import { BaseRoute } from './base_route'
import { upload } from '../../interfaceAdapters/config/multer.config'
import { handleMulterError } from '../middleware/multer_error_middleware'
import { authorizeRole, verifyAuth } from '../middleware/auth_middleware'
import { subServiceCategoryController } from '../di/resolver'
import { blockMyUserMiddleware } from '../di/resolver'
import { CustomRequestHandler } from '../../shared/types/custom_request'

export class SubServiceCategoryRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    this.router
      .route('/')
      .post(
        verifyAuth,
        authorizeRole(['admin', 'vendor']),
        handleMulterError(upload.single('SubServiceCategoryImage')),
        blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
        (req, res) =>
          subServiceCategoryController.createSubServiceCategories(req, res) //🤍
      )
      .get(
        (req, res) =>
          subServiceCategoryController.getAllSubServiceCategories(req, res) //🤍
      )
      .patch(
        verifyAuth,
        authorizeRole(['admin', 'vendor']),
        blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
        handleMulterError(upload.single('SubServiceCategoryImage')),
        (req, res) =>
          subServiceCategoryController.editSubServiceCategory(req, res) //🤍
      )

    this.router
      .route('/vendor-created')
      .get(verifyAuth, authorizeRole(['vendor']), (req, res) => {
        subServiceCategoryController.getVendorSubServiceCategories(req, res) //🤍
      })
    this.router.patch(
      '/verification/:subServiceCategoryId',
      verifyAuth,
      authorizeRole(['admin']),
      (req, res) => {
        subServiceCategoryController.toggleVerificationStatusOfSubServiceCategory(
          req,
          res
        )
      }
    ) //🤍

    this.router.get('/search/sub-service-categories', (req, res) => {
      subServiceCategoryController.getAllSubServiceCategoriesBasedOnServiceCategoryId(
        req,
        res
      )
    }) //🤍
    this.router
      .route('/:subServiceCategoryId')
      .get((req, res) =>
        subServiceCategoryController.getSingleSubServiceCategory(req, res)
      ) //🤍
      .patch(verifyAuth, authorizeRole(['admin']), (req, res) =>
        subServiceCategoryController.toggleBlockStatusOfSubServiceCategory(
          req,
          res
        )
      ) //🤍
  }
}
