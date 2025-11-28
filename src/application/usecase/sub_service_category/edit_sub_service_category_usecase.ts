import { inject, injectable } from 'tsyringe'
import {
  RequestEditSubServiceCategoriesDTO,
  ResponseEditSubServiceCategoriesDTO,
} from '../../dtos/sub_service_category_dto'
import { IEditSubServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/edit_sub_service_category_usecase.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS, S3_BUCKET_IMAGE_FOLDERS } from '../../../shared/constants'
import { IStorageService } from '../../../domain/serviceInterfaces/s3_storage_service_interface'
import { config } from '../../../shared/config'
import { ISubServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { EditSubServiceCategoryResponseMapper } from '../../mappers/sub_service_category/edit_sub_service_category_mapper'

@injectable()
export class EditSubServiceCategoryUseCase
  implements IEditSubServiceCategoryUseCase
{
  constructor(
    @inject('IStorageService')
    private _storageService: IStorageService,
    @inject('ISubServiceCategoryRepository')
    private _subServiceCategoryRepository: ISubServiceCategoryRepository
  ) {}
  async execute(
    payload: RequestEditSubServiceCategoriesDTO
  ): Promise<ResponseEditSubServiceCategoriesDTO> {
    const {
      subServiceCategoryId,
      name,
      description,
      serviceCategoryId,
      serviceCategoryName,
      bannerImage,
    } = payload
    console.log('Payload is ', payload)
    const SubServiceCategoryExists =
      await this._subServiceCategoryRepository.findOne({ subServiceCategoryId })
    if (!SubServiceCategoryExists) {
      throw new CustomError(
        'Sub Service Category Not Found',
        HTTP_STATUS.NOT_FOUND
      )
    }
    console.log('SubServiceCategoryExists', SubServiceCategoryExists)
    const bannerImageUrl = await this._storageService.uploadFile(
      config.storageConfig.bucket!,
      bannerImage,
      S3_BUCKET_IMAGE_FOLDERS.SUB_SERVICE_CATEGORY_IMAGES
    )
    const data = {
      name,
      description,
      serviceCategoryId,
      serviceCategoryName,
      bannerImage: bannerImageUrl,
    }
    console.log('data', data)
    const response = await this._subServiceCategoryRepository.update(
      { subServiceCategoryId },
      data
    )
    console.log('response', response)
    return EditSubServiceCategoryResponseMapper.toDTO(response)
  }
}
