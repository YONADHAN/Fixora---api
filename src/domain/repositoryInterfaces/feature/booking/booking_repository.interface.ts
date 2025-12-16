import { IBookingEntity } from '../../../models/booking_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
  findConfirmedBookedSlotsForService(
    serviceRef: string,
    month: number,
    year: number
  ): Promise<IBookingEntity[]>
}
