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
import { Schema } from 'mongoose'
import { IServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'

@injectable()
export class EditSubServiceCategoryUseCase
  implements IEditSubServiceCategoryUseCase
{
  constructor(
    @inject('IStorageService')
    private _storageService: IStorageService,
    @inject('ISubServiceCategoryRepository')
    private _subServiceCategoryRepository: ISubServiceCategoryRepository,
    @inject('IServiceCategoryRepository')
    private _serviceCategoryExists: IServiceCategoryRepository
  ) {}
  async execute(
    payload: RequestEditSubServiceCategoriesDTO
  ): Promise<ResponseEditSubServiceCategoriesDTO> {
    const {
      subServiceCategoryId,
      name,
      description,
      serviceCategoryId,
      bannerImage,
    } = payload
    //console.log('Payload is ', payload)
    const SubServiceCategoryExists =
      await this._subServiceCategoryRepository.findOne({ subServiceCategoryId })
    if (!SubServiceCategoryExists) {
      throw new CustomError(
        'Sub Service Category Not Found',
        HTTP_STATUS.NOT_FOUND
      )
    }

    const serviceCategoryExists = await this._serviceCategoryExists.findOne({
      serviceCategoryId,
    })
    if (!serviceCategoryExists) {
      throw new CustomError(
        'Service Category is Invalid',
        HTTP_STATUS.BAD_REQUEST
      )
    }
    // console.log(
    //   'SubServiceCategoryExists with _id',
    //   SubServiceCategoryExists._id,
    //   ' AND ServiceCategory with _id : ',
    //   serviceCategoryExists._id
    // )
    const serviceCategoryRef = serviceCategoryExists._id
    const bannerImageUrl = await this._storageService.uploadFile(
      config.storageConfig.bucket!,
      bannerImage,
      S3_BUCKET_IMAGE_FOLDERS.SUB_SERVICE_CATEGORY_IMAGES
    )

    const data = {
      name,
      description,
      serviceCategoryId,
      serviceCategoryRef,
      bannerImage: bannerImageUrl,
    }
    // console.log('data', data)
    await this._subServiceCategoryRepository.update(
      { subServiceCategoryId },
      data
    )

    const subServiceCategory =
      await this._subServiceCategoryRepository.findOneAndPopulate(
        { subServiceCategoryId },
        'serviceCategoryRef'
      )
    if (!subServiceCategory) {
      throw new CustomError(
        'Sub-service category not found',
        HTTP_STATUS.NOT_FOUND
      )
    }
    // console.log('response', subServiceCategory)
    return EditSubServiceCategoryResponseMapper.toDTO(subServiceCategory)
  }
}
