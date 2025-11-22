import { inject, injectable } from 'tsyringe'
import {
  RequestCreateSubServiceCategoryDTO,
  ResponseCreateSubServiceCategoryDTO,
} from '../../dtos/sub_service_category_dto'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS, S3_BUCKET_IMAGE_FOLDERS } from '../../../shared/constants'
import { ISubServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { ICreateSubServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/create_sub_service_usecase.interface'
import { S3StorageService } from '../../../interfaceAdapters/services/s3_storage_service'
import { config } from '../../../shared/config'
import { randomUUID } from 'crypto'
import { IServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'
import { IStorageService } from '../../../domain/serviceInterfaces/s3_storage_service_interface'
import { CreateSubServiceCategoryResponseMapper } from '../../mappers/sub_service_category/create_sub_service_category_mapper'
@injectable()
export class CreateSubServiceCategoryUseCase
  implements ICreateSubServiceCategoryUseCase
{
  constructor(
    @inject('ISubServiceCategoryRepository')
    private _subServiceCategoryRepository: ISubServiceCategoryRepository,
    @inject('IServiceCategoryRepository')
    private _serviceCategoryRepository: IServiceCategoryRepository,
    @inject('IStorageService')
    private _storageService: IStorageService
  ) {}

  async execute({
    name,
    description,
    bannerImage,
    serviceCategoryId,
    serviceCategoryName,
    createdById,
    createdByRole,
    isActive,
  }: RequestCreateSubServiceCategoryDTO): Promise<ResponseCreateSubServiceCategoryDTO> {
    const AlreadyExistServiceCategory =
      await this._serviceCategoryRepository.findOne({ serviceCategoryId })
    if (!AlreadyExistServiceCategory) {
      throw new CustomError(
        'Service Category Is Not Valid',
        HTTP_STATUS.NOT_FOUND
      )
    }
    const AlreadyExistSubServiceCategory =
      await this._subServiceCategoryRepository.findOne({
        name,
      })
    if (AlreadyExistSubServiceCategory) {
      throw new CustomError(
        'Already Existing Sub Category',
        HTTP_STATUS.CONFLICT
      )
    }
    const bannerImageUrl = await this._storageService.uploadFile(
      config.storageConfig.bucket!,
      bannerImage,
      S3_BUCKET_IMAGE_FOLDERS.SUB_SERVICE_CATEGORY_IMAGES
    )

    const subServiceCategoryId = randomUUID()
    const data = {
      name,
      description,
      bannerImage: bannerImageUrl,
      serviceCategoryId,
      serviceCategoryName,
      subServiceCategoryId,
      createdById,
      createdByRole,
      isActive,
    }
    const entity = await this._subServiceCategoryRepository.save(data)
    return CreateSubServiceCategoryResponseMapper.toDTO(entity)
  }
}
