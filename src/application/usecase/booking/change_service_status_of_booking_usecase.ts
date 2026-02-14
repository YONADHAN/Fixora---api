import { inject, injectable } from 'tsyringe'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'

import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { ChangeServiceStatusOfBookingRequestDTO } from '../../dtos/booking_dto'
import { IChangeServiceStatusOfBookingUseCase } from '../../../domain/useCaseInterfaces/booking/change_service_status_of_booking_usecase_interface'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { ICreateNotificationUseCase } from '../../../domain/useCaseInterfaces/notification/create_notification_usecase_interface'

@injectable()
export class ChangeServiceStatusOfBookingUseCase implements IChangeServiceStatusOfBookingUseCase {
  constructor(
    @inject('IBookingRepository')
    private readonly _bookingRepository: IBookingRepository,
    @inject('IVendorRepository')
    private readonly _vendorRepository: IVendorRepository,
    @inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,
    @inject('ICustomerRepository')
    private readonly _customerRepository: ICustomerRepository,
  ) {}
  async execute(
    input: ChangeServiceStatusOfBookingRequestDTO,
  ): Promise<{ updatedCount: number }> {
    const vendor = await this._vendorRepository.findOne({
      userId: input.userId,
    })

    if (!vendor) {
      throw new CustomError(
        ERROR_MESSAGES.USERS_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }
    // console.log(
    //   '%%%%%%%%%%%%%      Bookings group id        : =>   ',
    //   input.bookingGroupId,
    // )
    const booking = await this._bookingRepository.findOne({
      bookingGroupId: input.bookingGroupId,
    })

    if (!booking) {
      throw new CustomError('Bookings not found', HTTP_STATUS.NOT_FOUND)
    }

    const updatedCount = await this._bookingRepository.updateMany(
      {
        bookingGroupId: input.bookingGroupId,
        serviceStatus: 'scheduled',
      },
      {
        serviceStatus: 'completed',
      },
    )

    if (updatedCount === 0) {
      throw new CustomError('No bookings to update', HTTP_STATUS.BAD_REQUEST)
    }
    const customer = await this._customerRepository.findOne({
      _id: booking.customerRef.toString(),
    })
    if (!customer?.userId) {
      throw new CustomError(
        ERROR_MESSAGES.USERS_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      )
    }
    await this._createNotificationUseCase.execute({
      recipientId: customer.userId,
      recipientRole: 'customer',
      type: 'SERVICE_COMPLETED',
      title: 'Service Completed',
      message: `Service has been marked as completed by ${vendor.name}.`,
    })

    return { updatedCount }
  }
}
