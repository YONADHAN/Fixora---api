import { RequestCreateServiceDTO } from '../../../application/dtos/service_dto'

export interface ICreateServiceUseCase {
  execute(payload: RequestCreateServiceDTO): Promise<void>
}
