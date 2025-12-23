import { inject, injectable } from 'tsyringe'
import { CancelBookingRequestDTO } from '../../../dtos/booking_dto'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { ICustomerCancelBookingStrategyInterface } from './customer_cancel_booking_strategy.interface'

@injectable()
export class CustomerCancelBookingStrategy
  implements ICustomerCancelBookingStrategyInterface
{
  constructor(
    @inject('ICustomerRepository')
    private _customerRepository: ICustomerRepository,
    @inject('IBookingRepository')
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(payload: CancelBookingRequestDTO): Promise<void> {
    const { userId, bookingId, reason, role } = payload
    const booking = await this._bookingRepository.findOne({ bookingId })
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.NO_BOOKING_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }
    const user = await this._customerRepository.findOne({ userId })
    if (!(user && user._id)) {
      throw new CustomError(
        ERROR_MESSAGES.FILE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    if (booking.customerRef !== user._id.toString()) {
      throw new CustomError(
        ERROR_MESSAGES.CONFLICTING_INPUTS,
        HTTP_STATUS.CONFLICT
      )
    }
    booking.cancelInfo?.cancelledByRef
    //refund payment initiation stripe
    //payment schema updation
    //wallet transaction updation
    //booking schema updation
    await this._bookingRepository.update(
      { bookingId },
      {
        cancelInfo: {
          cancelledByRef: user._id.toString(),
          cancelledByRole: role,
          reason,
          cancelledAt: new Date(),
        },
        serviceStatus: 'cancelled',
      }
    )
  }
}
