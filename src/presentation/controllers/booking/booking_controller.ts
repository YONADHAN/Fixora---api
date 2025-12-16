import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'
import 'reflect-metadata'
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../../shared/constants'
import { IBookingController } from '../../../domain/controllerInterfaces/features/booking/booking-controller.interface'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { IGetAvailableSlotsForCustomerUseCase } from '../../../domain/useCaseInterfaces/booking/get_available_slots_for_customer_usecase_interface'
import {
  GetAvailableSlotsForCustomerBasicSchema,
  GetAvailableSlotsForCustomerRequestSchema,
} from '../../validations/booking/get_available_slots_for_customer_schema'
import { RequestGetAvailableSlotsForCustomerRequestMapper } from '../../../application/mappers/booking/get_available_slots_for_customer_mapper'

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject('IGetAvailableSlotsForCustomerUseCase')
    private readonly _getAvailableSlotsForCustomerUseCase: IGetAvailableSlotsForCustomerUseCase
  ) {}

  async getAvailableSlotsForCustomer(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const basic = GetAvailableSlotsForCustomerBasicSchema.parse(req.query)

      const dto = RequestGetAvailableSlotsForCustomerRequestMapper.toDTO(basic)

      const validatedDTO = GetAvailableSlotsForCustomerRequestSchema.parse(dto)

      const response =
        await this._getAvailableSlotsForCustomerUseCase.execute(validatedDTO)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SLOTS_FETCHED,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
