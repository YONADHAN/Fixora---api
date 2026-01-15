import { inject, injectable } from 'tsyringe'
import Stripe from 'stripe'
import { IBalancePaymentSucceededUseCase } from '../../../domain/useCaseInterfaces/booking/balance_payment_succeeded_usecase_interface'
import { IPaymentRepository } from '../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'

@injectable()
export class BalancePaymentSucceededUseCase
  implements IBalancePaymentSucceededUseCase {
  constructor(
    @inject('IPaymentRepository')
    private readonly _paymentRepository: IPaymentRepository,
    @inject('IBookingRepository')
    private readonly _bookingRepository: IBookingRepository
  ) { }

  async execute(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const bookingGroupId = paymentIntent.metadata?.bookingGroupId
    const paymentType = paymentIntent.metadata?.paymentType

    if (!bookingGroupId || paymentType !== 'balance') {
      return
    }

    const payment = await this._paymentRepository.findOne({
      bookingGroupId: bookingGroupId,
    })

    if (!payment) return

    await this._paymentRepository.updateRemainingPaymentByBookingGroupId(
      bookingGroupId,
      {
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount_received / 100,
        status: 'paid',
        paidAt: new Date(),
        failures: [],
      }
    )

    const bookings = await this._bookingRepository.findAllDocsWithoutPagination({
      bookingGroupId,
    })
    for (const booking of bookings) {
      await this._bookingRepository.update(
        { bookingId: booking.bookingId },
        { paymentStatus: 'fully-paid' }
      )
    }
  }
}
