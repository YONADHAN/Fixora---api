import {
  RequestEditServiceDTO,
  ResponseEditServiceDTO,
} from '../../../application/dtos/service_dto'

export interface IEditServiceUseCase {
  execute(
    serviceId: string,
    payload: RequestEditServiceDTO
  ): Promise<ResponseEditServiceDTO>
}
