import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'tsyringe'
import { GetPaymentsUseCase } from '../../../application/usecase/payment/get_payments_usecase'
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../../shared/constants'
import { GetPaymentHistoryRequestDTO } from '../../../application/dtos/payment_dto'
import { IPaymentController } from '../../../domain/controllerInterfaces/features/payment/payment_controller.interface'
import { CustomRequest } from '../../middleware/auth_middleware'
import { handleErrorResponse } from '../../../shared/utils/error_handler'

@injectable()
export class PaymentController implements IPaymentController {
    constructor(
        @inject(GetPaymentsUseCase)
        private readonly _getPaymentsUseCase: GetPaymentsUseCase
    ) { }

    async getPayments(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 10, search } = req.query
            const { userId, role } = (req as CustomRequest).user

            const payload: GetPaymentHistoryRequestDTO = {
                userId,
                role,
                page: Number(page),
                limit: Number(limit),
                search: search as string,
            }

            const result = await this._getPaymentsUseCase.execute(payload)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Payments fetched successfully',
                data: result,
            })
        } catch (error) {
            handleErrorResponse(req, res, error)
        }
    }
}
