import { TRole } from '../../../shared/constants'
import { IVendorAnalyticsStrategy } from '../../strategies/dashboard/vendor/IVendorAnalyticsStrategy'

export interface IVendorAnalyticsFactory {
  getStrategy(role: TRole): IVendorAnalyticsStrategy
}
