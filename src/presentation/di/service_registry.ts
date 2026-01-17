import { container } from 'tsyringe'
import { DashboardEventsService } from '../services/dashboard_events.service'

export const registerServices = () => {
    container.register('IDashboardEventsService', {
        useClass: DashboardEventsService,
    })
}
