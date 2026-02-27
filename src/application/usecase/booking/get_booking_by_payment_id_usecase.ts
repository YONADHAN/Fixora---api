import { inject, injectable } from 'tsyringe'
import { GetBookingByPaymentIdResponseDTO } from '../../dtos/booking_dto'
import { IBookingEntity } from '../../../domain/models/booking_entity'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IPaymentRepository } from '../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import { IGetBookingByPaymentIdUseCase } from '../../../domain/useCaseInterfaces/booking/get_booking_by_payment_id_usecase_interface'


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
    
    const payment = await this._paymentRepository.findOne({
      'advancePayment.stripePaymentIntentId': paymentId,
    })

    if (!payment) {
      
      return null
    }

    if (!payment.slots || payment.slots.length === 0) {
      return null
    }

    
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
