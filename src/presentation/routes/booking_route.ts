import { CustomRequestHandler } from '../../shared/types/custom_request'
import { bookingController, blockMyUserMiddleware } from '../di/resolver'

import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from '../middleware/auth_middleware'

import { BaseRoute } from './base_route'
import { Request, Response } from 'express'

export class BookingRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    this.router.get(
      '/payment/:paymentId',
      verifyAuth,
      authorizeRole(['customer']),
      (req: Request, res: Response) =>
        bookingController.getBookingByPaymentId(req, res),
    )

    this.router.get('/slots/availability', (req: Request, res: Response) =>
      bookingController.getAvailableSlotsForCustomer(req, res),
    )
    this.router.post(
      '/booking-holds',
      verifyAuth,
      authorizeRole(['customer']),
      (req: Request, res: Response) =>
        bookingController.createBookingHold(req, res),
    )

    this.router.post(
      '/booking-holds/:holdId/payment-intent',
      verifyAuth,
      authorizeRole(['customer']),
      (req: Request, res: Response) =>
        bookingController.createPaymentIntent(req, res),
    )

    this.router.get(
      '/me',
      verifyAuth,
      decodeToken,
      authorizeRole(['customer', 'vendor', 'admin']),
      blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
      (req, res) => bookingController.getMyBookings(req, res),
    )

    this.router.get(
      '/:bookingId',
      verifyAuth,
      decodeToken,
      authorizeRole(['customer', 'vendor', 'admin']),
      blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
      (req, res) => bookingController.getBookingDetails(req, res),
    )

    this.router.patch(
      '/:bookingId/cancel',
      verifyAuth,
      authorizeRole(['customer', 'vendor', 'admin']),
      blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
      (req: Request, res: Response) =>
        bookingController.cancelBooking(req, res),
    )

    this.router.post(
      '/:bookingId/pay-balance',
      verifyAuth,
      authorizeRole(['customer']),
      (req: Request, res: Response) => bookingController.payBalance(req, res),
    )

    this.router.post(
      '/:bookingGroupId/service-status',
      verifyAuth,
      authorizeRole(['vendor']),
      (req: Request, res: Response) =>
        bookingController.changeServiceStatus(req, res),
    )
  }
}
