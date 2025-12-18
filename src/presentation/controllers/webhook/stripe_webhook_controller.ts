import { Request, Response } from 'express'
import Stripe from 'stripe'
import { inject, injectable } from 'tsyringe'
import { config } from '../../../shared/config'

import { IStripePaymentFailedUseCase } from '../../../domain/useCaseInterfaces/booking_hold/stripe_payment_failed_usecase_interface'
import { IStripePaymentSucceedUseCase } from '../../../domain/useCaseInterfaces/booking_hold/stripe_payment_succeeded_usecase_interface'
import { IStripeWebhookController } from '../../../domain/controllerInterfaces/features/webhook/stripe-webhook-controller.interface'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
const stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY)

@injectable()
export class StripeWebhookController implements IStripeWebhookController {
  constructor(
    @inject('IStripePaymentSucceedUseCase')
    private _paymentSucceededUseCase: IStripePaymentSucceedUseCase,

    @inject('IStripePaymentFailedUseCase')
    private _paymentFailedUseCase: IStripePaymentFailedUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const sig = req.headers['stripe-signature']

      if (!sig) {
        res.status(400).send('Missing stripe signature')
        return
      }

      let event: Stripe.Event

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          config.stripe.STRIPE_WEBHOOK_SECRET
        )
      } catch (err) {
        res.status(400).send('Webhook signature verification failed')
        return
      }

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this._paymentSucceededUseCase.execute(
            event.data.object as Stripe.PaymentIntent
          )
          break

        case 'payment_intent.payment_failed':
          await this._paymentFailedUseCase.execute(
            event.data.object as Stripe.PaymentIntent
          )
          break
        default:
          break
      }

      res.json({ received: true })
    } catch (error) {
      console.error('Stripe webhook error:', error)
      handleErrorResponse(req, res, error)
    }
  }
}
