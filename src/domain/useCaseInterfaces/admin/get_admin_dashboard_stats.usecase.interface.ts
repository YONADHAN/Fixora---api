import { IVendorEntity } from '../../models/vendor_entity'

export interface IGetAdminDashboardStatsUseCase {
  execute(): Promise<{
    totalVendors: number
    activeVendors: number
    totalBookings: number
    totalRevenue: number
  }>
}
