import { inject, injectable } from 'tsyringe'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import {
  RequestToggleBlockServiceDTO,
  ResponseToggleBlockServiceDTO,
} from '../../dtos/service_dto'
import { IToggleBlockServiceUseCase } from '../../../domain/useCaseInterfaces/service/toggle_block_service_usecase.interface'

@injectable()
export class ToggleBlockServiceUseCase implements IToggleBlockServiceUseCase {
  constructor(
    @inject('IServiceRepository') private serviceRepo: IServiceRepository
  ) {}

  async execute(
    payload: RequestToggleBlockServiceDTO
  ): Promise<ResponseToggleBlockServiceDTO> {
    const service = await this.serviceRepo.findOne({
      serviceId: payload.serviceId,
    })

    if (!service) {
      throw new CustomError('Service not found', HTTP_STATUS.NOT_FOUND)
    }

    const newStatus = !service.isActiveStatusByVendor

    const updated = await this.serviceRepo.update(
      { serviceId: payload.serviceId },
      { isActiveStatusByVendor: newStatus }
    )

    return {
      isActiveStatusByVendor: updated?.isActiveStatusByVendor ? true : false,
    }
  }
}
