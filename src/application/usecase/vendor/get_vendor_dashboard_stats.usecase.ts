import { inject, injectable } from 'tsyringe'
import { IReviewRepository } from '../../../domain/repositoryInterfaces/feature/review/review_repository.interface'
import { IGetVendorDashboardStatsUseCase } from '../../../domain/useCaseInterfaces/vendor/get_vendor_dashboard_stats.usecase.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { IPaymentRepository } from '../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'

@injectable()
export class GetVendorDashboardStatsUseCase
    implements IGetVendorDashboardStatsUseCase {
    constructor(
        @inject('IVendorRepository') private vendorRepo: IVendorRepository,
        @inject('IBookingRepository') private bookingRepo: IBookingRepository,
        @inject('IPaymentRepository') private paymentRepo: IPaymentRepository,
        @inject('IReviewRepository') private reviewRepo: IReviewRepository
    ) { }

    async execute(vendorUserId: string): Promise<{
        activeBookings: number
        completedJobs: number
        totalEarnings: number
        rating: number
    }> {


        const vendor = await this.vendorRepo.findOne({ userId: vendorUserId })
        if (!vendor) throw new Error('Vendor not found')

        const vendorId = vendor.userId as string

        const activeBookings = await this.bookingRepo.countDocuments({
            vendorRef: vendorId,
            serviceStatus: { $in: ['scheduled', 'in-progress'] },
        })

        const completedJobs = await this.bookingRepo.countDocuments({
            vendorRef: vendorId,
            serviceStatus: 'completed',
        })

        const totalEarnings = await this.paymentRepo.calculateTotalRevenue({
            vendorRef: vendorId,
        })

        const { avgRating } = await this.reviewRepo.calculateAverageForVendor(vendorId)

        return {
            activeBookings,
            completedJobs,
            totalEarnings,
            rating: avgRating,
        }
    }
}
