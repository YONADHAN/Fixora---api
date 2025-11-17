import { IAuthController } from 'domain/controllerInterfaces/users/auth-controller.interface'
import { ICustomerController } from 'domain/controllerInterfaces/users/customer-controller.interface'
import { IBlockMyUserMiddleware } from 'presentation/middleware/block_middleware'
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from '../middleware/auth_middleware'
import { BaseRoute } from './base_route'
import { Request, Response } from 'express'
import { CustomRequestHandler } from '../../shared/types/custom_request'

export class CustomerRoutes extends BaseRoute {
  constructor(
    private authController: IAuthController,
    private customerController: ICustomerController,
    private blockMyUserMiddleware: IBlockMyUserMiddleware
  ) {
    super()
  }

  protected initializeRoutes(): void {
    //Post Refresh Token Route
    this.router.post(
      '/refresh-token',
      decodeToken,
      (req: Request, res: Response) => {
        this.authController.handleTokenRefresh(req, res)
      }
    )

    //  Global middlewares for all authenticated customer routes
    this.router.use(
      verifyAuth as CustomRequestHandler,
      this.blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
      authorizeRole(['customer'])
    )

    //  Logout
    this.router.post('/logout', (req: Request, res: Response) => {
      this.customerController.logout(req, res)
    })

    //  Get profile
    this.router.get('/profile-info', (req: Request, res: Response) => {
      this.customerController.profileInfo(req, res)
    })

    //  Update profile
    this.router.patch('/update-profile-info', (req: Request, res: Response) => {
      this.customerController.profileUpdate(req, res)
    })
    this.router.post(
      '/change-password',

      (req: Request, res: Response) => {
        this.authController.changeMyPassword(req, res)
      }
    )
  }
}
