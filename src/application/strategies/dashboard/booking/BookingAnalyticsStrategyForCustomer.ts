import {inject,injectable} from 'tsyringe'

import {
    BookingDashboardResponseDTO,
    DashboardStatsInputDTO,
} from '../../../dtos/dashboard_dto'
import { IBookingAnalyticsStrategy } from './IBookingAnalyticsStrategy'
import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'

@injectable()
export class BookingAnalytisStrategyForCustomer implements IBookingAnalyticsStrategy {
    constructor(
        @inject('IBookingRepository')
        private readonly bookingRepository: IBookingRepository,
        @inject('ICustomerRepository')
        private readonly _customerRepository: ICustomerRepository,
    ){}
    async execute(input: DashboardStatsInputDTO): Promise<BookingDashboardResponseDTO>{
        const {from,to} = input.dateRange
        const customerId = input.user.userId
        const customer = await this._customerRepository.findOne({userId: customerId})
        if(!customer){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        }
        return this.bookingRepository.getBookingDashboardAnalytics({
            from,
            to,
            interval: input.interval,
            customerRef: customer?._id?.toString()

        })
    }
}