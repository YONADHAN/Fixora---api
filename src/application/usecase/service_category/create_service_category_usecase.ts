import { inject, injectable } from 'tsyringe'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../../../shared/config'
import { ICreateServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/service_category/create_service_category_usecase.interface'
import { IServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'
import { IStorageService } from '../../../domain/serviceInterfaces/s3_storage_service_interface'

@injectable()
export class CreateServiceCategoryUseCase
  implements ICreateServiceCategoryUseCase
{
  constructor(
    @inject('IServiceCategoryRepository')
    private _serviceCategoryRepository: IServiceCategoryRepository,

    @inject('IStorageService')
    private _storageService: IStorageService
  ) {}
  async execute({
    name,
    description,
    bannerImage,
  }: {
    name: string
    description: string
    bannerImage?: Express.Multer.File
  }) {
    if (!bannerImage) {
      throw new Error('Banner image is required')
    }

    const serviceCategoryId = uuidv4()

    const bannerImageUrl = await this._storageService.uploadFile(
      config.storageConfig.bucket!,
      bannerImage,
      'service-categories'
    )

    await this._serviceCategoryRepository.save({
      serviceCategoryId,
      name,
      description,
      bannerImage: bannerImageUrl,
      isActive: true,
    })
  }
}
