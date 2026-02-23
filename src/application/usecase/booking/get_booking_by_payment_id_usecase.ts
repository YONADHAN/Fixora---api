import { inject, injectable } from 'tsyringe'
import { GetBookingByPaymentIdResponseDTO } from '../../dtos/booking_dto'
import { IBookingEntity } from '../../../domain/models/booking_entity'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IPaymentRepository } from '../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import { IGetBookingByPaymentIdUseCase } from '../../../domain/useCaseInterfaces/booking/get_booking_by_payment_id_usecase_interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'

@injectable()
export class GetBookingByPaymentIdUseCase
  implements IGetBookingByPaymentIdUseCase
{
  constructor(
    @inject('IBookingRepository')
    private readonly _bookingRepository: IBookingRepository,
    @inject('IPaymentRepository')
    private readonly _paymentRepository: IPaymentRepository
  ) {}

  async execute(
    paymentId: string
  ): Promise<GetBookingByPaymentIdResponseDTO | null> {
    // paymentId here is the Stripe Payment Intent ID
    const payment = await this._paymentRepository.findOne({
      'advancePayment.stripePaymentIntentId': paymentId,
    })

    if (!payment) {
      // Fallback: Check if it's a Hold ID (in case we want to support that too, though less reliable as booking might not exist)
      // For now, strict payment intent lookup.
      return null
    }

    if (!payment.slots || payment.slots.length === 0) {
      return null
    }

    // Assuming we want the first booking associated with this payment
    // (In the current flow, one checkout = one hold = multiple slots = multiple bookings, but usually displayed together.
    // However, the success page is generic. Let's return the first one.)
    const bookingId = payment.slots[0].bookingId

    const booking = await this._bookingRepository.findOne({ bookingId })

    if (!booking) {
      return null
    }

    return {
      bookingId: booking.bookingId,
      bookingGroupId: booking.bookingGroupId,
    }
  }
}
