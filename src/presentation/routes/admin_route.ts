import { adminController, authController } from '../di/resolver'
import { BaseRoute } from './base_route'
import { Request, Response } from 'express'
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from '../middleware/auth_middleware'
import { ServiceCategoryRoutes } from './service_category_route'
import { SubServiceCategoryRoutes } from './sub_service_category_route'
export class AdminRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    this.router.post(
      '/logout',
      verifyAuth,
      authorizeRole(['admin']),
      (req: Request, res: Response) => {
        adminController.logout(req, res)
      }
    )

    this.router.post(
      '/refresh-token',
      decodeToken,
      (req: Request, res: Response) => {
        authController.handleTokenRefresh(req, res)
      }
    )

    this.router.post(
      '/get-all-customers',
      verifyAuth,
      authorizeRole(['admin']),
      (req: Request, res: Response) => {
        adminController.getAllCustomers(req, res)
      }
    )

    this.router.post(
      '/get-all-vendors',
      verifyAuth,
      authorizeRole(['admin']),
      (req: Request, res: Response) => {
        adminController.getAllVendors(req, res)
      }
    )
    this.router.get(
      '/get_vendor_requests',
      verifyAuth,
      authorizeRole(['admin']),
      (req, res) => adminController.getAllVendorRequests(req, res)
    )

    this.router.post(
      '/vendor-verification-status',
      verifyAuth,
      authorizeRole(['admin']),
      (req: Request, res: Response) =>
        adminController.changeMyVendorVerificationStatus(req, res)
    )

    this.router.post(
      '/change-my-user-block-status',
      verifyAuth,
      authorizeRole(['admin']),
      (req: Request, res: Response) => {
        adminController.changeMyUserBlockStatus(req, res)
      }
    )
    this.router.post(
      '/change-password',

      (req: Request, res: Response) => {
        authController.changeMyPassword(req, res)
      }
    )
    //service-category route
    this.router.use('/category', new ServiceCategoryRoutes().router)
    this.router.use(
      '/sub-service-category',
      new SubServiceCategoryRoutes().router
    )
  }
}
