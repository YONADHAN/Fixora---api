import { VendorDashboardResponseDTO } from '../../../application/dtos/dashboard_dto'
import { timeGranularityType } from '../../../shared/constants'
import { IVendorEntity } from '../../models/vendor_entity'
import { IBaseRepository } from '../base_repository.interface'
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
}
