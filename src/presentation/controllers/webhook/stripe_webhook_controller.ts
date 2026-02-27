import { Request, Response } from 'express'
import Stripe from 'stripe'
import { inject, injectable } from 'tsyringe'
import { config } from '../../../shared/config'

import { IStripePaymentFailedUseCase } from '../../../domain/useCaseInterfaces/booking_hold/stripe_payment_failed_usecase_interface'
import { IStripePaymentSucceedUseCase } from '../../../domain/useCaseInterfaces/booking_hold/stripe_payment_succeeded_usecase_interface'
import { IStripeWebhookController } from '../../../domain/controllerInterfaces/features/webhook/stripe-webhook-controller.interface'
import { IBalancePaymentSucceededUseCase } from '../../../domain/useCaseInterfaces/booking/balance_payment_succeeded_usecase_interface'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { ISubscriptionCheckoutCompletedUseCase } from '../../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_checkout_completed_usecase.interface'
import { ISubscriptionInvoicePaidUseCase } from '../../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_invoice_paid_usecase.interface'
import { ISubscriptionInvoiceFailedUseCase } from '../../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_invoice_failed_usecase.interface'
import { ISubscriptionCancelledUseCase } from '../../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_cancelled_usecase.interface'
const stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY)

@injectable()
export class StripeWebhookController implements IStripeWebhookController {
  constructor(
    @inject('IStripePaymentSucceedUseCase')
    private _paymentSucceededUseCase: IStripePaymentSucceedUseCase,

    @inject('IStripePaymentFailedUseCase')
    private _paymentFailedUseCase: IStripePaymentFailedUseCase,

    @inject('IBalancePaymentSucceededUseCase')
    private _balancePaymentSucceededUseCase: IBalancePaymentSucceededUseCase,

    @inject('ISubscriptionCheckoutCompletedUseCase')
    private _subscriptionCheckoutCompletedUseCase: ISubscriptionCheckoutCompletedUseCase,

    @inject('ISubscriptionInvoicePaidUseCase')
    private _subscriptionInvoicePaidUseCase: ISubscriptionInvoicePaidUseCase,

    @inject('ISubscriptionInvoiceFailedUseCase')
    private _subscriptionInvoiceFailedUseCase: ISubscriptionInvoiceFailedUseCase,

    @inject('ISubscriptionCancelledUseCase')
    private _subscriptionCancelledUseCase: ISubscriptionCancelledUseCase,

    
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
          config.stripe.STRIPE_WEBHOOK_SECRET,
        )
      } catch (err) {
        res.status(400).send('Webhook signature verification failed')
        return
      }

      switch (event.type) {
        case 'payment_intent.succeeded':
          console.log("Payment intent succeeded worked")
          await this._paymentSucceededUseCase.execute(
            event.data.object as Stripe.PaymentIntent,
          )
          break

        case 'payment_intent.payment_failed':
          await this._paymentFailedUseCase.execute(
            event.data.object as Stripe.PaymentIntent,
          )
          break

        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session

          if (session.mode === 'subscription') {
            await this._subscriptionCheckoutCompletedUseCase.execute(session)
            break
          }

          if (
            session.mode === 'payment' &&
            typeof session.payment_intent === 'string'
          ) {
            const paymentIntent = await stripe.paymentIntents.retrieve(
              session.payment_intent,
            )

            await this._balancePaymentSucceededUseCase.execute(paymentIntent)
          }

          break
        }
        case 'invoice.payment_succeeded':
          await this._subscriptionInvoicePaidUseCase.execute(
            event.data.object as Stripe.Invoice,
          )
          break

        case 'invoice.payment_failed':
          await this._subscriptionInvoiceFailedUseCase.execute(
            event.data.object as Stripe.Invoice,
          )
          break

        case 'customer.subscription.deleted':
          await this._subscriptionCancelledUseCase.execute(
            event.data.object as Stripe.Subscription,
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
