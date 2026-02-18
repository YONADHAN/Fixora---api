import { FilterQuery } from 'mongoose'
import { IBookingModel } from '../../../../interfaceAdapters/database/mongoDb/models/booking_model'
import { IBookingEntity } from '../../../models/booking_entity'
import { IBaseRepository } from '../../base_repository.interface'
import {
  BookingDashboardResponseDTO,
  DashboardStatsInputDTO,
} from '../../../../application/dtos/dashboard_dto'
import { timeGranularityType } from '../../../../shared/constants'

export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
  findConfirmedBookedSlotsForService(
    serviceRef: string,
    month: number,
    year: number,
  ): Promise<IBookingEntity[]>

  findBookingsForUser(
    page: number,
    limit: number,
    search: string,
    filters: FilterQuery<IBookingEntity>,
  ): Promise<{
    data: IBookingEntity[]
    currentPage: number
    totalPages: number
  }>

  findCompletedBookingsForReview(
    customerRef: string,
    serviceRef: string,
  ): Promise<IBookingEntity[]>

  getBookingById(bookingId: string): Promise<IBookingEntity | null>
  getBookingDashboardAnalytics(params: {
    from: Date
    to: Date
    interval: timeGranularityType
    vendorRef?: string
    customerRef?: string
  }): Promise<BookingDashboardResponseDTO>

  countUniqueCustomersForVendor(vendorRef: string): Promise<number>
  countUniqueServicesForCustomer(customerRef: string): Promise<number>
  getAllServicesWhichCompletedBookings(
    customerRef: string,
    page: number,
    limit: number,
    search?: string,
    sortBy?: 'createdAt' | 'serviceName',
    sortOrder?: 'asc' | 'desc',
  ): Promise<{
    data: IBookingEntity[]
    totalPages: number
    currentPage: number
  }>
}
