import {
  RequestSearchServicesForCustomerDTO,
  ResponseSearchServicesForCustomerDTO,
} from '../../../application/dtos/service_dto'

export interface ISearchServicesForCustomersUseCase {
  execute(
    dto: RequestSearchServicesForCustomerDTO
  ): Promise<ResponseSearchServicesForCustomerDTO>
}
