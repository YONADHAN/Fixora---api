import { inject, injectable } from 'tsyringe'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import {
  GetAvailableSlotsForCustomerRequestDTO,
  GetAvailableSlotsForCustomerResponseDTO,
} from '../../dtos/booking_dto'
import { IBookingServices } from '../../../domain/serviceInterfaces/booking_service_interface'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IGetAvailableSlotsForCustomerUseCase } from '../../../domain/useCaseInterfaces/booking/get_available_slots_for_customer_usecase_interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'

@injectable()
export class GetAvailableSlotsForCustomerUseCase
  implements IGetAvailableSlotsForCustomerUseCase
{
  constructor(
    @inject('IBookingRepository')
    private _bookingRepository: IBookingRepository,
    @inject('IServiceRepository')
    private _serviceRepository: IServiceRepository,
    @inject('IBookingServices')
    private _bookingServices: IBookingServices
  ) {}

  async execute(
    validatedDTO: GetAvailableSlotsForCustomerRequestDTO
  ): Promise<GetAvailableSlotsForCustomerResponseDTO> {
    const service = await this._serviceRepository.findOne({
      serviceId: validatedDTO.serviceId,
    })
    if (!service) {
      throw new CustomError(
        ERROR_MESSAGES.SERVICES_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    if (!service._id) {
      throw new CustomError(
        ERROR_MESSAGES.SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    }

    const serviceRef = service._id

    const bookings =
      await this._bookingRepository.findConfirmedBookedSlotsForService(
        serviceRef,
        validatedDTO.month,
        validatedDTO.year
      )

    const slotsAvailable =
      await this._bookingServices.showAvailableSlotsForCustomers(
        service,
        validatedDTO.month,
        validatedDTO.year,
        bookings
      )

    return slotsAvailable
  }
}
