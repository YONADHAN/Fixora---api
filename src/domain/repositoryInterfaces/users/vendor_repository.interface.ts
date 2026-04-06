import { VendorDashboardResponseDTO } from '../../../application/dtos/dashboard_dto'

import { timeGranularityType } from '../../../shared/constants'
import { IVendorEntity } from '../../models/vendor_entity'
import { IBaseRepository } from '../base_repository.interface'
type SortField = 'name' | 'email' | 'createdAt';
type Status= 'all' | 'pending' | 'active' | 'blocked'
export interface IVendorRepository extends IBaseRepository<IVendorEntity> {
  findNearestVendors(
    lat: number,
    lng: number,
    radiusInKm: number,
  ): Promise<IVendorEntity[]>
  getVendorDashboardAnalytics(params: {
    from: Date
    to: Date
    interval: timeGranularityType
  }): Promise<VendorDashboardResponseDTO>
  findVendorsWithFilters(params: {
    page: number
    limit: number
    search: string
    sortField: SortField
    sortOrder: 'asc' | 'desc'
    status: Status
  }): Promise<{data: IVendorEntity[],currentPage: number, totalPages: number}> 
}
