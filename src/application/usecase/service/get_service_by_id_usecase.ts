import { injectable, inject } from 'tsyringe'
import {
  RequestGetServiceByIdDTO,
  ResponseGetServiceByIdDTO,
} from '../../dtos/service_dto'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'
import { GetServiceByIdResponseMapper } from '../../mappers/service/get_service_by_id_mapper'
import { IGetServiceByIdUseCase } from '../../../domain/useCaseInterfaces/service/get_service_by_id_usecase.interface'

@injectable()
export class GetServiceByIdUseCase implements IGetServiceByIdUseCase {
  constructor(
    @inject('IServiceRepository')
    private _serviceRepo: IServiceRepository
  ) {}
  async execute(
    dto: RequestGetServiceByIdDTO
  ): Promise<ResponseGetServiceByIdDTO> {
    const { serviceId } = dto
    const serviceExists = await this._serviceRepo.findOne({ serviceId })
    if (!serviceExists) {
      throw new CustomError('Service is not found', HTTP_STATUS.NOT_FOUND)
    }
    const response = GetServiceByIdResponseMapper.toDTO(serviceExists)
    return response
  }
}
