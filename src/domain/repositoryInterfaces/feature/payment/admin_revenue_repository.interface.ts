import { IAdminRevenueModel } from '../../../../interfaceAdapters/database/mongoDb/models/admin_revenue_model'
import { IAdminRevenueEntity } from '../../../models/admin_revenue_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface IAdminRevenueRepository extends IBaseRepository<
  IAdminRevenueModel,
  IAdminRevenueEntity
> {
  getTotalRevenue(): Promise<number>

  getRevenueBySource(source: string): Promise<number>

  
}