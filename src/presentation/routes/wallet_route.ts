import { Request, Response } from 'express'
import { BaseRoute } from './base_route'
import { authorizeRole, verifyAuth } from '../middleware/auth_middleware'
import { walletController } from '../di/resolver'

export class WalletRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    this.router.get(
      '/',
      verifyAuth,
      authorizeRole(['customer', 'vendor','admin']),
      (req: Request, res: Response) => walletController.getMyWallet(req, res)
    )
  }
}
