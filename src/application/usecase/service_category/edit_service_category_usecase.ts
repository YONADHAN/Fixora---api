import { inject, injectable } from 'tsyringe'
import { IServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'

import { IStorageService } from '../../../domain/serviceInterfaces/s3_storage_service_interface'
import { config } from '../../../shared/config'
import { IEditServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/service_category/edit_service_category_usecase.interface'

@injectable()
export class EditServiceCategoryUseCase implements IEditServiceCategoryUseCase {
  constructor(
    @inject('IServiceCategoryRepository')
    private _serviceCategoryRepository: IServiceCategoryRepository,

    @inject('IStorageService')
    private _storageService: IStorageService
  ) {}

  async execute(
    categoryId: string,
    name: string,
    description: string,
    bannerImage?: Express.Multer.File
  ) {
    //console.log('category id got:', categoryId)
    const category = await this._serviceCategoryRepository.findOne({
      serviceCategoryId: categoryId,
    })

    if (!category) {
      throw new Error('Category not found')
    }

    let bannerImageUrl = category.bannerImage

    if (bannerImage) {
      if (category.bannerImage) {
        await this._storageService.deleteFile(
          config.storageConfig.bucket!,
          category.bannerImage
        )
      }

      bannerImageUrl = await this._storageService.uploadFile(
        config.storageConfig.bucket!,
        bannerImage,
        'service-categories'
      )
    }

    category.name = name
    category.description = description
    category.bannerImage = bannerImageUrl

    await this._serviceCategoryRepository.update(
      { serviceCategoryId: categoryId },
      category
    )
  }
}
