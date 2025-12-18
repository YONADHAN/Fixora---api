import {
  bookingController,
  customerController,
  serviceController,
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
export class BookingRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    // -------------------------------
    // SLOT AVAILABILITY
    // -------------------------------
    this.router.get('/slots/availability', (req: Request, res: Response) =>
      bookingController.getAvailableSlotsForCustomer(req, res)
    )
    this.router.post(
      '/booking-holds',
      verifyAuth,
      authorizeRole(['customer']),
      (req: Request, res: Response) =>
        bookingController.createBookingHold(req, res)
    )

    this.router.post(
      '/booking-holds/:holdId/payment-intent',
      verifyAuth,
      authorizeRole(['customer']),
      (req: Request, res: Response) =>
        bookingController.createPaymentIntent(req, res)
    )
  }
}
