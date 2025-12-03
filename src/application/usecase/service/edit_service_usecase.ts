import { inject, injectable } from 'tsyringe'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { IStorageService } from '../../../domain/serviceInterfaces/s3_storage_service_interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS, S3_BUCKET_IMAGE_FOLDERS } from '../../../shared/constants'
import { config } from '../../../shared/config'
import {
  RequestEditServiceDTO,
  ResponseEditServiceDTO,
} from '../../dtos/service_dto'
import { EditServiceResponseMapper } from '../../mappers/service/get_service_by_id_mapper'
import { IEditServiceUseCase } from '../../../domain/useCaseInterfaces/service/edit_service_usecase.interface'

@injectable()
export class EditServiceUseCase implements IEditServiceUseCase {
  constructor(
    @inject('IServiceRepository') private serviceRepo: IServiceRepository,
    @inject('IStorageService') private storageService: IStorageService
  ) {}

  async execute(
    serviceId: string,
    payload: RequestEditServiceDTO
  ): Promise<ResponseEditServiceDTO> {
    const service = await this.serviceRepo.findOne({ serviceId })

    if (!service) {
      throw new CustomError('Service not found', HTTP_STATUS.NOT_FOUND)
    }

    // Upload new images if provided
    let updatedImages = service.images

    if (payload.images && payload.images.length > 0) {
      const uploaded = []
      for (const file of payload.images) {
        const url = await this.storageService.uploadFile(
          config.storageConfig.bucket!,
          file,
          `${S3_BUCKET_IMAGE_FOLDERS.SERVICE_IMAGES}/${serviceId}`
        )
        uploaded.push(url)
      }
      updatedImages = uploaded
    }

    const updatedEntity = {
      ...service,
      ...payload,
      images: updatedImages,
      schedule: {
        ...service.schedule,
        ...payload.schedule,
      },
      pricing: {
        ...service.pricing,
        ...payload.pricing,
      },
      updatedAt: new Date(),
    }

    const response = await this.serviceRepo.update({ serviceId }, updatedEntity)
    return EditServiceResponseMapper.toDTO(response)
  }
}
