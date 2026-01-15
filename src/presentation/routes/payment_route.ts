import { BaseRoute } from './base_route'
import {
    authorizeRole,
    verifyAuth,
} from '../middleware/auth_middleware'
import { paymentController } from '../di/resolver'
import { ROLES } from '../../shared/constants'
import { Request, Response } from 'express'

export class PaymentRoutes extends BaseRoute {
    constructor() {
        super()
    }

    protected initializeRoutes(): void {
        this.router.get(
            '/',
            verifyAuth,
            authorizeRole([ROLES.CUSTOMER, ROLES.VENDOR]),
            (req: Request, res: Response) => {
                paymentController.getPayments(req, res)
            }
        )
    }
}
