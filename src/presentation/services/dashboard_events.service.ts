import { injectable } from 'tsyringe'
import { getIO } from '../socket/socket.server'
import { IDashboardEventsService } from '../../domain/serviceInterfaces/dashboard_events_service.interface'
import { SOCKET_EVENTS } from '../../shared/constants'

@injectable()
export class DashboardEventsService implements IDashboardEventsService {
    notifyAdminDashboardStatsUpdate(): void {
        const io = getIO()
        io.to('admin_dashboard').emit(SOCKET_EVENTS.DASHBOARD_STATS_UPDATE)
    }

    notifyVendorDashboardStatsUpdate(vendorId: string): void {
        const io = getIO()
        io.to(`vendor_${vendorId}_dashboard`).emit(SOCKET_EVENTS.DASHBOARD_STATS_UPDATE)
    }
}
