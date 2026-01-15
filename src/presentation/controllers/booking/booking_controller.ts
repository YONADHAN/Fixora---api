import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'
import 'reflect-metadata'
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  TRole,
} from '../../../shared/constants'
import { IBookingController } from '../../../domain/controllerInterfaces/features/booking/booking-controller.interface'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { IGetAvailableSlotsForCustomerUseCase } from '../../../domain/useCaseInterfaces/booking/get_available_slots_for_customer_usecase_interface'
import {
  GetAvailableSlotsForCustomerBasicSchema,
  GetAvailableSlotsForCustomerRequestSchema,
} from '../../validations/booking/get_available_slots_for_customer_schema'
import { RequestGetAvailableSlotsForCustomerRequestMapper } from '../../../application/mappers/booking/get_available_slots_for_customer_mapper'
import {
  CreateBookingHoldBasicSchema,
  CreateBookingHoldRequestSchema,
} from '../../validations/booking_hold/create_booking_hold_schema'
import { CreateBookingHoldRequestMapper } from '../../../application/mappers/booking_hold/create_booking_hold_mapper'
import { ICreateBookingHoldUseCase } from '../../../domain/useCaseInterfaces/booking_hold/create_booking_hold_usecase_interface'
import { CustomRequest } from '../../middleware/auth_middleware'
import { createStripePaymentIntentSchema } from '../../validations/booking_hold/create_stripe_payment_intent_schema'
import { ICreateStripePaymentIntentUseCase } from '../../../domain/useCaseInterfaces/booking_hold/create_stripe_payment_intent_usecase_interface'
import { getMyBookingsRequestSchema } from '../../validations/booking/get_bookings_schema'
import { IGetBookingsUseCase } from '../../../domain/useCaseInterfaces/booking/get_bookings_usecase_interface'
import { ICancelBookingUseCase } from '../../../domain/useCaseInterfaces/booking/cancel_booking_usecase_interface'
import { IGetBookingDetailsUseCase } from '../../../domain/useCaseInterfaces/booking/get_booking_details_usecase_interface'
import { IGetBookingByPaymentIdUseCase } from '../../../domain/useCaseInterfaces/booking/get_booking_by_payment_id_usecase_interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { IPayBalanceUseCase } from '../../../domain/useCaseInterfaces/booking/pay_balance_usecase_interface'

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject('IGetAvailableSlotsForCustomerUseCase')
    private readonly _getAvailableSlotsForCustomerUseCase: IGetAvailableSlotsForCustomerUseCase,
    @inject('ICreateBookingHoldUseCase')
    private readonly _createBookingHoldUseCase: ICreateBookingHoldUseCase,
    @inject('ICreateStripePaymentIntentUseCase')
    private readonly _createStripePaymentIntentUseCase: ICreateStripePaymentIntentUseCase,
    @inject('IGetBookingsUseCase')
    private readonly _getBookingsUseCase: IGetBookingsUseCase,
    @inject('ICancelBookingUseCase')
    private readonly _cancelBookingUseCase: ICancelBookingUseCase,
    @inject('IGetBookingDetailsUseCase')
    private readonly _getBookingDetailsUseCase: IGetBookingDetailsUseCase,
    @inject('IGetBookingByPaymentIdUseCase')
    private readonly _getBookingByPaymentIdUseCase: IGetBookingByPaymentIdUseCase,
    @inject('IPayBalanceUseCase')
    private readonly _payBalanceUseCase: IPayBalanceUseCase
  ) { }

  async getAvailableSlotsForCustomer(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const basic = GetAvailableSlotsForCustomerBasicSchema.parse(req.query)

      const dto = RequestGetAvailableSlotsForCustomerRequestMapper.toDTO(basic)

      const validatedDTO = GetAvailableSlotsForCustomerRequestSchema.parse(dto)

      const response = await this._getAvailableSlotsForCustomerUseCase.execute(
        validatedDTO
      )

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SLOTS_FETCHED,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async createBookingHold(req: Request, res: Response): Promise<void> {
    try {
      const basic = CreateBookingHoldBasicSchema.parse(req.body)
      const dto = CreateBookingHoldRequestMapper.toDTO(basic)
      const validatedDTO = CreateBookingHoldRequestSchema.parse(dto)
      const customerId = (req as CustomRequest).user.userId
      const response = await this._createBookingHoldUseCase.execute(
        validatedDTO,
        customerId
      )
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.BOOKING_HOLD_CREATED,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async createPaymentIntent(req: Request, res: Response): Promise<void> {
    try {
      const { holdId } = req.params
      const validatedDTO = createStripePaymentIntentSchema.parse(holdId)
      const response = await this._createStripePaymentIntentUseCase.execute(
        validatedDTO
      )

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Payment intent created',
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async payBalance(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params

      const checkoutUrl = await this._payBalanceUseCase.execute(bookingId)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Balance payment session created',
        checkoutUrl
      })

    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }


  async getMyBookings(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.userId
      const role = (req as CustomRequest).user.role

      const dto = {
        ...req.query,
        userId,
        role,
      }

      const validatedDTO = getMyBookingsRequestSchema.parse(dto)

      const bookings = await this._getBookingsUseCase.execute(validatedDTO)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: bookings,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = req.params.bookingId
      const { reason } = req.body
      const userId = (req as CustomRequest).user.userId
      const role = (req as CustomRequest).user.role as TRole

      if (!reason || typeof reason !== 'string' || !reason.trim()) {
        throw new CustomError(
          ERROR_MESSAGES.CANCELLATION_REASON_NEEDED,
          HTTP_STATUS.BAD_REQUEST
        )
      }
      await this._cancelBookingUseCase.execute({
        bookingId,
        userId,
        role,
        reason: reason.trim(),
      })
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.CANCELLED_BOOKING_SUCCESSFULLY,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getBookingDetails(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = req.params.bookingId
      const userId = (req as CustomRequest).user.userId
      const role = (req as CustomRequest).user.role as TRole
      const data = await this._getBookingDetailsUseCase.execute({
        bookingId,
        userId,
        role,
      })
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.FOUND_BOOKING_DETAILS,
        data,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }



  async getBookingByPaymentId(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params
      const userId = (req as CustomRequest).user.userId
      const role = (req as CustomRequest).user.role as TRole

      const booking = await this._getBookingByPaymentIdUseCase.execute(paymentId)

      if (!booking) {
        throw new CustomError(
          ERROR_MESSAGES.NO_BOOKING_FOUND,
          HTTP_STATUS.NOT_FOUND
        )
      }

      // Reuse the getBookingDetails usecase logic to get full details
      const data = await this._getBookingDetailsUseCase.execute({
        bookingId: booking.bookingId,
        userId,
        role,
      })

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.FOUND_BOOKING_DETAILS,
        data,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
