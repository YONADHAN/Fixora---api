import { GetAvailableSlotsForCustomerRequestDTO } from '../../dtos/booking_dto'

export class RequestGetAvailableSlotsForCustomerRequestMapper {
  static toDTO(data: { month: string; year: string; serviceId: string }) {
    return {
      month: Number(data.month),
      year: Number(data.year),
      serviceId: data.serviceId,
    }
  }
}
