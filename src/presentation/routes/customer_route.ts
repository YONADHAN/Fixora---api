import {
  authController,
  customerController,
  blockMyUserMiddleware,
} from '../di/resolver'
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from '../middleware/auth_middleware'
import { BaseRoute } from './base_route'
import { Request, Response } from 'express'
import { CustomRequestHandler } from '../../shared/types/custom_request'

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
  }
}
