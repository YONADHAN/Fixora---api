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
    // // -------------------------------
    // // SLOT AVAILABILITY (Customer)
    // // -------------------------------
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
    // this.router.post(
    //   '/slots/book',
    //   bookingController.createNewBooking
    // )
    // // -------------------------------
    // // SLOT HOLD (Before Payment)
    // // -------------------------------
    // this.router.post(
    //   '/holds',
    //   verifyAuth,
    //   authorizeRole(['customer']),
    //   bookingController.createSlotHold
    // )
    // this.router.get(
    //   '/holds/:holdId',
    //   verifyAuth,
    //   authorizeRole(['customer']),
    //   bookingController.getSlotHoldDetails
    // )
    // // -------------------------------
    // // CONFIRMED BOOKINGS
    // // -------------------------------
    // this.router.get(
    //   '/bookings/:bookingId',
    //   verifyAuth,
    //   bookingController.getBookingDetails
    // )
    // this.router.get(
    //   '/bookings/:bookingId/payment-status',
    //   verifyAuth,
    //   bookingController.getBookingPaymentStatus
    // )
    // this.router.get(
    //     '/bookings/:bookingId/work-status',
    //     verifyAuth,
    //     bookingController.getBookingWorkStatus
    // )
    // this.router.patch(
    //   '/bookings/:bookingId/cancel',
    //   verifyAuth,
    //   authorizeRole(['customer']),
    //   bookingController.cancelBooking
    // )
    // this.router.get(
    //   '/bookings/service/:serviceId',
    //   verifyAuth,
    //   authorizeRole(['vendor', 'admin']),
    //   bookingController.getAllBookingsForService
    // )
  }
}
