import { TRole } from '../../shared/constants'

export interface DashboardStatsInputDTO {
  dateRange: {
    from: Date
    to: Date
  }
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly'
  user: {
    role: TRole
    userId: string
  }
}
