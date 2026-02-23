import {
  RequestGetServiceByIdDTO,
  ResponseGetServiceByIdDTO,
} from '../../../application/dtos/service_dto'

export interface IGetServiceByIdUseCase {
  execute(dto: RequestGetServiceByIdDTO): Promise<ResponseGetServiceByIdDTO>
}
