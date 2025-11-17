import { BaseRoute } from './base_route'
import { Request, Response } from 'express'
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from '../middleware/auth_middleware'
import { ServiceCategoryRoutes } from './service_category_route'
import { IAuthController } from 'domain/controllerInterfaces/users/auth-controller.interface'
import { IAdminController } from 'domain/controllerInterfaces/users/admin-controller.interface'
import { IServiceCategoryController } from 'domain/controllerInterfaces/features/service/service-category-controller.interface'
export class AdminRoutes extends BaseRoute {
  constructor(
    private authController: IAuthController,
    private adminController: IAdminController,
    private serviceCategoryController: IServiceCategoryController
  ) {
    super()
  }

  protected initializeRoutes(): void {
    this.router.post(
      '/logout',
      verifyAuth,
      authorizeRole(['admin']),
      (req: Request, res: Response) => {
        this.adminController.logout(req, res)
      }
    )

    this.router.post(
      '/refresh-token',
      decodeToken,
      (req: Request, res: Response) => {
        this.authController.handleTokenRefresh(req, res)
      }
    )

    this.router.post(
      '/get-all-customers',
      verifyAuth,
      authorizeRole(['admin']),
      (req: Request, res: Response) => {
        this.adminController.getAllCustomers(req, res)
      }
    )

    this.router.post(
      '/get-all-vendors',
      verifyAuth,
      authorizeRole(['admin']),
      (req: Request, res: Response) => {
        this.adminController.getAllVendors(req, res)
      }
    )
    this.router.get(
      '/get_vendor_requests',
      verifyAuth,
      authorizeRole(['admin']),
      (req, res) => this.adminController.getAllVendorRequests(req, res)
    )

    this.router.post(
      '/vendor-verification-status',
      verifyAuth,
      authorizeRole(['admin']),
      (req: Request, res: Response) =>
        this.adminController.changeMyVendorVerificationStatus(req, res)
    )

    this.router.post(
      '/change-my-user-block-status',
      verifyAuth,
      authorizeRole(['admin']),
      (req: Request, res: Response) => {
        this.adminController.changeMyUserBlockStatus(req, res)
      }
    )
    this.router.post(
      '/change-password',

      (req: Request, res: Response) => {
        this.authController.changeMyPassword(req, res)
      }
    )
    //service-category route
    this.router.use(
      '/category',
      new ServiceCategoryRoutes(this.serviceCategoryController).router
    )
  }
}
