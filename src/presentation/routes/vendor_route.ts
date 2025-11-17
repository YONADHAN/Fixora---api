import { IAuthController } from 'domain/controllerInterfaces/users/auth-controller.interface'
import { IVendorController } from 'domain/controllerInterfaces/users/vendor-controller.interface'
import { IBlockMyUserMiddleware } from 'presentation/middleware/block_middleware'
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

export class VendorRoutes extends BaseRoute {
  constructor(
    private authController: IAuthController,
    private vendorController: IVendorController,
    private blockMyUserMiddleware: IBlockMyUserMiddleware
  ) {
    super()
  }

  protected initializeRoutes(): void {
    // Post Refresh Token Route
    this.router.post(
      '/refresh-token',
      decodeToken,
      (req: Request, res: Response) => {
        this.authController.handleTokenRefresh(req, res)
      }
    )

    //  Global middlewares for all authenticated vendor routes
    this.router.use(
      verifyAuth as CustomRequestHandler,
      this.blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
      authorizeRole(['vendor'])
    )

    //logout
    this.router.post('/logout', (req: Request, res: Response) => {
      this.vendorController.logout(req, res)
    })

    // Post Verification Document
    this.router.post(
      '/upload_verification_document',
      handleMulterError(upload.array('files', 3)),
      (req: Request, res: Response) => {
        this.vendorController.uploadVerificationDocument(req, res)
      }
    )

    // Get Profile
    this.router.get('/profile-info', (req: Request, res: Response) => {
      this.vendorController.profileInfo(req, res)
    })

    // Update Profile
    this.router.patch('/update-profile-info', (req: Request, res: Response) => {
      this.vendorController.profileUpdate(req, res)
    })

    //Get Status
    this.router.get('/status', (req: Request, res: Response) => {
      this.vendorController.vendorVerificationDocStatusCheck(req, res)
    })
    this.router.post(
      '/change-password',

      (req: Request, res: Response) => {
        this.authController.changeMyPassword(req, res)
      }
    )
  }
}
