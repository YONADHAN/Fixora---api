import {
  authController,
  customerController,
  blockMyUserMiddleware,
  serviceCategoryController,
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
import { SubServiceCategoryRoutes } from './sub_service_category_route'
import { ServiceRoutes } from './service_route'
import { BookingRoutes } from './booking_route'
import { WalletRoutes } from './wallet_route'
import { NotificationRoutes } from './notification_route'
import { ChatRoutes } from './chat_route'

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

    this.router.use('/chats', new ChatRoutes().router)

    this.router.use('/booking', new BookingRoutes().router)

    this.router.use('/service', new ServiceRoutes().router)

    this.router.get('/service_category', (req: Request, res: Response) => {
      serviceCategoryController.getActiveServiceCategories(req, res)
    })

    this.router.use('/wallet', new WalletRoutes().router)

    this.router.use('/notification', new NotificationRoutes().router)

    this.router.use(
      '/sub-service-category',
      new SubServiceCategoryRoutes().router
    )

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
