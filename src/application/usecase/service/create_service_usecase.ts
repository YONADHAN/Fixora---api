import { inject, injectable } from 'tsyringe'
import { randomUUID } from 'crypto'
import { ICreateServiceUseCase } from '../../../domain/useCaseInterfaces/service/create_service_category_usecase.interface'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { ISubServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IStorageService } from '../../../domain/serviceInterfaces/s3_storage_service_interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS, S3_BUCKET_IMAGE_FOLDERS } from '../../../shared/constants'
import { RequestCreateServiceDTO } from '../../dtos/service_dto'
import { IServiceEntity } from '../../../domain/models/service_entity'
import { config } from '../../../shared/config'

@injectable()
export class CreateServiceUseCase implements ICreateServiceUseCase {
  constructor(
    @inject('IServiceRepository') private serviceRepo: IServiceRepository,
    @inject('ISubServiceCategoryRepository')
    private subCategoryRepo: ISubServiceCategoryRepository,
    @inject('IVendorRepository') private vendorRepo: IVendorRepository,
    @inject('IStorageService') private storageService: IStorageService
  ) {}

  async execute(payload: RequestCreateServiceDTO): Promise<void> {
    const {
      vendorId,
      subServiceCategoryId,
      title,
      description,
      pricing,
      isActiveStatusByVendor,
      isActiveStatusByAdmin,
      adminStatusNote,
      schedule,
      images,
    } = payload

    const vendor = await this.vendorRepo.findOne({ userId: vendorId })

    if (!vendor)
      throw new CustomError('Vendor not found', HTTP_STATUS.NOT_FOUND)
    if (!vendor._id)
      throw new CustomError(
        'Vendor ID missing in database record',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )

    const category = await this.subCategoryRepo.findOne({
      subServiceCategoryId,
    })

    if (!category)
      throw new CustomError(
        'Sub service category not found',
        HTTP_STATUS.NOT_FOUND
      )
    if (!category._id)
      throw new CustomError(
        'Sub-category ID missing in database record',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )

    const serviceId = randomUUID()

    const uploadedImageUrls: string[] = []
    for (const file of images) {
      const url = await this.storageService.uploadFile(
        config.storageConfig.bucket!,
        file,
        `${S3_BUCKET_IMAGE_FOLDERS.SERVICE_IMAGES}/${serviceId}`
      )
      uploadedImageUrls.push(url)
    }

    const entity: IServiceEntity = {
      vendorRef: vendor._id.toString(),
      subServiceCategoryRef: category._id.toString(),

      title,
      description,

      pricing: {
        pricePerSlot: pricing.pricePerSlot,
        isAdvanceRequired: pricing.isAdvanceRequired,
        advanceAmountPerSlot: pricing.advanceAmountPerSlot,
        currency: pricing.currency ?? 'INR',
      },

      images: uploadedImageUrls,

      isActiveStatusByAdmin: isActiveStatusByAdmin ?? true,
      isActiveStatusByVendor,
      adminStatusNote: adminStatusNote ?? '',

      schedule: {
        ...schedule,
      },

      serviceHistoryRefs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await this.serviceRepo.save(entity)
  }
}
