
export interface IGetVendorDashboardStatsUseCase {
    execute(vendorId: string): Promise<{
        activeBookings: number
        completedJobs: number
        totalEarnings: number
        rating: number
    }>
}
