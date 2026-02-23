import {inject,injectable} from 'tsyringe'
import {
   DashboardStatsInputDTO,
   SummaryAnalyticsResponseDTO,
} from '../../../dtos/dashboard_dto'

import { ISummaryAnalyticsStrategy } from './ISummaryAnalyticsStrategy'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'


@injectable()
export class SummaryAnalyticsStrategyForCustomer implements ISummaryAnalyticsStrategy {
   constructor(
   
      @inject('IBookingRepository')
      private readonly _bookingRepository: IBookingRepository,
    
      @inject('ICustomerRepository')
      private readonly _customerRepository: ICustomerRepository,

   ){}

   async execute(input: DashboardStatsInputDTO): Promise<SummaryAnalyticsResponseDTO>{
      const customerId = input.user.userId;
      // const {from , to} = input.dateRange;
      const customer = await this._customerRepository.findOne({userId: customerId})
      if(!customer) {
         throw new CustomError(ERROR_MESSAGES.USERS_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
      }
      const customerObjectId = customer._id!.toString()
     
      const [
         totalBookings,
         cancelledBookings,
         completedBookings,
         bookedServices,
      ] = await Promise.all([
         this._bookingRepository.countDocuments({customerRef: customer?._id}),
         this._bookingRepository.countDocuments({customerRef: customer?._id, serviceStatus: 'cancelled'}),
         this._bookingRepository.countDocuments({customerRef: customer?._id, serviceStatus: 'completed'}),
         this._bookingRepository.countUniqueServicesForCustomer(customerObjectId),
      ])

      return {
         totalBookings: totalBookings?? 0,
         cancelledBookings: cancelledBookings?? 0,
         completedBookings: completedBookings?? 0,
         bookedServices: bookedServices?? 0,
      }
   }
}