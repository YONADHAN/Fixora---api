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

import { IEditServiceUseCase } from '../../../domain/useCaseInterfaces/service/edit_service_usecase.interface'
import { IServiceEntity } from '../../../domain/models/service_entity'

@injectable()
export class EditServiceUseCase implements IEditServiceUseCase {
  constructor(
    @inject('IServiceRepository') private serviceRepo: IServiceRepository,
    @inject('IStorageService') private storageService: IStorageService
  ) {}

  async execute(payload: RequestEditServiceDTO): Promise<void> {
    const service = await this.serviceRepo.findOne({
      serviceId: payload.serviceId,
    })

    if (!service) {
      throw new CustomError('Service not found', HTTP_STATUS.NOT_FOUND)
    }

    const url = await this.storageService.uploadFile(
      config.storageConfig.bucket!,
      payload.mainImage,
      `${S3_BUCKET_IMAGE_FOLDERS.SERVICE_IMAGES}/${payload.serviceId}`
    )

    let mainImage = url

    //logics

    //

    const updatedEntity: Partial<IServiceEntity> = {
      name: payload.name,
      description: payload.description,

      serviceVariants: payload.serviceVariants,

      pricing: {
        ...service.pricing,
        ...payload.pricing,
      },

      mainImage,

      schedule: {
        ...service.schedule,
        ...payload.schedule,
      },

      updatedAt: new Date(),
    }

    await this.serviceRepo.update(
      { serviceId: payload.serviceId },
      updatedEntity
    )
  }
}
