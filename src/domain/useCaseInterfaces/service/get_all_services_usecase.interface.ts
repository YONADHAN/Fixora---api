import {
  RequestGetAllServicesDTO,
  ResponseGetAllServicesDTO,
} from '../../../application/dtos/service_dto'

export interface IGetAllServicesUseCase {
  execute(payload: RequestGetAllServicesDTO): Promise<ResponseGetAllServicesDTO>
}
