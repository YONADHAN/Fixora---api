import { Request, Response } from 'express'

export interface IBookingController {
  getAvailableSlotsForCustomer(req: Request, res: Response): Promise<void>
  createBookingHold(req: Request, res: Response): Promise<void>
  createPaymentIntent(req: Request, res: Response): Promise<void>
}
