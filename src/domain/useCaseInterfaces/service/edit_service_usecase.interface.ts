import { RequestEditServiceDTO } from '../../../application/dtos/service_dto'

export interface IEditServiceUseCase {
  execute(payload: RequestEditServiceDTO): Promise<void>
}
