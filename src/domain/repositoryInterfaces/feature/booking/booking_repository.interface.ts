import { FilterQuery } from 'mongoose'
import { IBookingModel } from '../../../../interfaceAdapters/database/mongoDb/models/booking_model'
import { IBookingEntity } from '../../../models/booking_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
  findConfirmedBookedSlotsForService(
    serviceRef: string,
    month: number,
    year: number
  ): Promise<IBookingEntity[]>

  findBookingsForUser(
    page: number,
    limit: number,
    search: string,
    filters: FilterQuery<IBookingModel>
  ): Promise<{
    data: IBookingEntity[]
    currentPage: number
    totalPages: number
  }>

  //  findBookingWithDetailsForVendor(filter: FilterQuery<IBookingModel>)
}
