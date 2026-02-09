import { timeGranularityType } from '../../../../shared/constants'
import { IServiceEntity } from '../../../models/service_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface IServiceRepository extends IBaseRepository<IServiceEntity> {
  getServiceGrowth(params: {
    from: Date
    to: Date
    interval: timeGranularityType
  }): Promise<{ label: string; totalServices: number }[]>

  getServiceStatusOverview(): Promise<{
    totalServices: number
    activeServices: number
    inactiveServices: number
  }>

  getServiceUsageOverview(params: { from: Date; to: Date }): Promise<{
    servicesWithBookings: number
    servicesWithoutBookings: number
  }>

  getTopServices(params: {
    from: Date
    to: Date
    limit?: number
  }): Promise<
    { serviceId: string; serviceName: string; totalBookings: number }[]
  >

  getTopServicesForAI(): Promise<
    {
      name: string
      categoryName: string
      priceRange?: string
    }[]
  >

  searchForAI(query: string): Promise<
    {
      name: string
      shortDescription?: string
    }[]
  >
}
