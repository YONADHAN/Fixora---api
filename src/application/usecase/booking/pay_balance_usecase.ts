import { inject, injectable } from 'tsyringe'
import Stripe from 'stripe'
import { config } from '../../../shared/config'
import { IPayBalanceUseCase } from '../../../domain/useCaseInterfaces/booking/pay_balance_usecase_interface'
import { IPaymentRepository } from '../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'

const stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY)

@injectable()
export class PayBalanceUseCase implements IPayBalanceUseCase {
  constructor(
    @inject('IPaymentRepository')
    private readonly _paymentRepository: IPaymentRepository
  ) {}

  async execute(bookingId: string): Promise<string> {
    // Find payment using bookingId
    const payment = await this._paymentRepository.findOne({
      'slots.bookingId': bookingId,
    })

    if (!payment) {
      throw new CustomError(
        ERROR_MESSAGES.NO_BOOKING_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    const bookingGroupId = payment.bookingGroupId

    // Calculate total remaining across all slots in this group
    const remainingAmount = payment.slots.reduce((sum, slot) => {
      if (slot.status === 'advance-paid') {
        return sum + slot.pricing.remainingAmount
      }
      return sum
    }, 0)

    if (remainingAmount <= 0) {
      throw new CustomError(
        'No remaining balance to pay',
        HTTP_STATUS.BAD_REQUEST
      )
    }

    //  Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Balance Payment for Booking Group ${bookingGroupId}`,
            },
            unit_amount: Math.round(remainingAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${config.cors.FRONTEND_URL}/customer/booking/success?groupId=${bookingGroupId}`,
      cancel_url: `${config.cors.FRONTEND_URL}/customer/booking/${bookingId}`,
      payment_intent_data: {
        metadata: {
          bookingGroupId,
          paymentType: 'balance',
        },
      },
    })

    if (!session.url) {
      throw new CustomError(
        'Failed to create Stripe Checkout Session',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    }

    return session.url
  }
}
