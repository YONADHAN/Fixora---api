import { CustomerDashboardResponseDTO } from '../../../application/dtos/dashboard_dto'
import { timeGranularityType } from '../../../shared/constants'
import { ICustomerEntity } from '../../models/customer_entity'
import { IBaseRepository } from '../base_repository.interface'
export interface ICustomerRepository extends IBaseRepository<ICustomerEntity> {
  getCustomerDashboardAnalytics(params: {
    from: Date
    to: Date
    interval: timeGranularityType
    vendorRef?: string
  }): Promise<CustomerDashboardResponseDTO>
}
