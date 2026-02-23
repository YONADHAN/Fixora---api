import { TRole } from '../../../shared/constants'
import { IServiceAnalyticsStrategy } from '../../strategies/dashboard/service/IServiceAnalyticsStrategy'

export interface IServiceAnalyticsFactory {
    getStrategy(role: TRole): IServiceAnalyticsStrategy
}
