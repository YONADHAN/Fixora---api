import { ChangeServiceStatusOfBookingRequestDTO } from '../../../application/dtos/booking_dto'
export interface IChangeServiceStatusOfBookingUseCase {
  execute(
    input: ChangeServiceStatusOfBookingRequestDTO,
  ): Promise<{ updatedCount: number }>
}
