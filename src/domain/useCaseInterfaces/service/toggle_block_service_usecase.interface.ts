import {
  RequestToggleBlockServiceDTO,
  ResponseToggleBlockServiceDTO,
} from '../../../application/dtos/service_dto'

export interface IToggleBlockServiceUseCase {
  execute(
    serviceId: RequestToggleBlockServiceDTO
  ): Promise<ResponseToggleBlockServiceDTO>
}
