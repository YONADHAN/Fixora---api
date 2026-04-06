import { CustomerDashboardResponseDTO } from '../../../application/dtos/dashboard_dto'

import { timeGranularityType } from '../../../shared/constants'
import { ICustomerEntity } from '../../models/customer_entity'
import { IBaseRepository } from '../base_repository.interface'
type SortField = 'name' | 'email' | 'createdAt';
type Status= 'all' | 'pending' | 'active' | 'blocked'
export interface ICustomerRepository extends IBaseRepository<ICustomerEntity> {
  getCustomerDashboardAnalytics(params: {
    from: Date
    to: Date
    interval: timeGranularityType
    vendorRef?: string
  }): Promise<CustomerDashboardResponseDTO>
  findCustomersWithFilters(params: {
    page: number
    limit: number
    search: string
    sortField: SortField
    sortOrder: 'asc' | 'desc'
    status: Status
  }): Promise<{data: ICustomerEntity[],currentPage: number, totalPages: number}> 
}
