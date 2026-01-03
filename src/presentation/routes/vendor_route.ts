import {
  authController,
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
import multer from 'multer'
import { CustomRequestHandler } from '../../shared/types/custom_request'
import { handleMulterError } from '../middleware/multer_error_middleware'
import { upload } from '../../interfaceAdapters/config/multer.config'
import { SubServiceCategoryRoutes } from './sub_service_category_route'
import { ServiceRoutes } from './service_route'
import { BookingRoutes } from './booking_route'
import { WalletRoutes } from './wallet_route'
import { ChatRoutes } from './chat_route'

export class VendorRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    // Post Refresh Token Route
    this.router.post(
      '/refresh-token',
      decodeToken,
      (req: Request, res: Response) => {
        authController.handleTokenRefresh(req, res)
      }
    )

    this.router.use('/chat', new ChatRoutes().router)

    this.router.use('/service', new ServiceRoutes().router)

    this.router.use('/booking', new BookingRoutes().router)

    this.router.use('/wallet', new WalletRoutes().router)

    //  Global middlewares for all authenticated vendor routes
    this.router.use(
      verifyAuth as CustomRequestHandler,
      blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
      authorizeRole(['vendor'])
    )

    this.router.use(
      '/sub-service-category',
      new SubServiceCategoryRoutes().router
    )

    //logout
    this.router.post('/logout', (req: Request, res: Response) => {
      vendorController.logout(req, res)
    })

    // Post Verification Document
    this.router.post(
      '/upload_verification_document',
      handleMulterError(upload.array('files', 3)),
      (req: Request, res: Response) => {
        vendorController.uploadVerificationDocument(req, res)
      }
    )

    // Get Profile
    this.router.get('/profile-info', (req: Request, res: Response) => {
      vendorController.profileInfo(req, res)
    })

    // Update Profile
    this.router.patch('/update-profile-info', (req: Request, res: Response) => {
      vendorController.profileUpdate(req, res)
    })
    // Upload Profile Image
    this.router.post(
      '/avatar',
      handleMulterError(upload.single('profileImage')),
      (req: Request, res: Response) => {
        vendorController.uploadProfileImage(req, res)
      }
    )

    //Get Status
    this.router.get('/status', (req: Request, res: Response) => {
      vendorController.vendorVerificationDocStatusCheck(req, res)
    })
    this.router.post(
      '/change-password',

      (req: Request, res: Response) => {
        authController.changeMyPassword(req, res)
      }
    )
  }
}
