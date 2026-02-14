import { BookingAvailabilityDTO } from '../../application/dtos/booking_dto'
import { IBookingEntity } from '../models/booking_entity'
import { IServiceEntity } from '../models/service_entity'

export interface IBookingServices {
  showAvailableSlotsForCustomers(
    service: IServiceEntity,
    month: number,
    year: number,
    bookedSlots: IBookingEntity[]
  ): Promise<BookingAvailabilityDTO>
}
