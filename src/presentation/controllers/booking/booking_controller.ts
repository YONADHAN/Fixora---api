import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'
import 'reflect-metadata'
import { HTTP_STATUS, SUCCESS_MESSAGES, TRole } from '../../../shared/constants'
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
import { IGetBookingsUseCase } from '../../../domain/useCaseInterfaces/booking/get_bookings_usecase'
import { ICancelBookingUseCase } from '../../../domain/useCaseInterfaces/booking/cancel_booking_usecase_interface'

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
    private readonly _cancelBookingUseCase: ICancelBookingUseCase
  ) {}

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
      const reason = req.params.reason
      const userId = (req as CustomRequest).user.userId
      const role = (req as CustomRequest).user.role as TRole
      await this._cancelBookingUseCase.execute({
        bookingId,
        userId,
        role,
        reason,
      })
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.CANCELLED_BOOKING_SUCCESSFULLY,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
