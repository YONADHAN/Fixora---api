import {  Request, Response } from 'express'

export interface IPaymentController {
    getPayments(req: Request, res: Response): Promise<void>
}
