import {
  authController,
  customerController,
  blockMyUserMiddleware,
  vendorController,
} from '../di/resolver'
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from '../middleware/auth_middleware'
import { BaseRoute } from './base_route'
import { Request, Response } from 'express'
import { CustomRequestHandler } from '../../shared/types/custom_request'
import { handleMulterError } from '../middleware/multer_error_middleware'
import { upload } from '../../interfaceAdapters/config/multer.config'

export class CustomerRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    //Post Refresh Token Route
    this.router.post(
      '/refresh-token',
      decodeToken,
      (req: Request, res: Response) => {
        authController.handleTokenRefresh(req, res)
      }
    )

    this.router.get('/service_category', (req: Request, res: Response) => {
      customerController.getServiceCategories(req, res)
    })

    //  Global middlewares for all authenticated customer routes
    this.router.use(
      verifyAuth as CustomRequestHandler,
      blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
      authorizeRole(['customer'])
    )

    //  Logout
    this.router.post('/logout', (req: Request, res: Response) => {
      customerController.logout(req, res)
    })

    //  Get profile
    this.router.get('/profile-info', (req: Request, res: Response) => {
      customerController.profileInfo(req, res)
    })

    //  Update profile
    this.router.patch('/update-profile-info', (req: Request, res: Response) => {
      customerController.profileUpdate(req, res)
    })
    this.router.post(
      '/change-password',

      (req: Request, res: Response) => {
        authController.changeMyPassword(req, res)
      }
    )

    this.router.post(
      '/avatar',
      handleMulterError(upload.single('profileImage')),
      (req: Request, res: Response) => {
        customerController.uploadProfileImage(req, res)
      }
    )
  }
}
