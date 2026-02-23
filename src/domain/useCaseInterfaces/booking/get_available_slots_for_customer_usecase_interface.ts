import {
  GetAvailableSlotsForCustomerRequestDTO,
  GetAvailableSlotsForCustomerResponseDTO,
} from '../../../application/dtos/booking_dto'

export interface IGetAvailableSlotsForCustomerUseCase {
  execute(
    validatedDTO: GetAvailableSlotsForCustomerRequestDTO
  ): Promise<GetAvailableSlotsForCustomerResponseDTO>
}
