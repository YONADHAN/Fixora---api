import { Request, Response } from 'express'

export interface IStripeWebhookController {
  handle(req: Request, res: Response): Promise<void>
}
