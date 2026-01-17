export interface IDashboardEventsService {
    notifyAdminDashboardStatsUpdate(): void
    notifyVendorDashboardStatsUpdate(vendorId: string): void
}
