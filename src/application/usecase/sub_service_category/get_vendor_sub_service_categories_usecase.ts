import { inject, injectable } from 'tsyringe'
import { ISubServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'
import {
  RequestGetVendorSubServiceCategoriesDTO,
  ResponseGetVendorSubServiceCategoriesDTO,
} from '../../dtos/sub_service_category_dto'
import { GetVendorSubServiceCategoriesResponseMapper } from '../../mappers/sub_service_category/get_vendor_sub_service_category_mapper'
import { IGetVendorSubServiceCategoriesUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/get_vendor_sub_service_categories_usecase.interface'
@injectable()
export class GetVendorSubServiceCategoriesUseCase
  implements IGetVendorSubServiceCategoriesUseCase
{
  constructor(
    @inject('ISubServiceCategoryRepository')
    private _subServiceCategoryRepository: ISubServiceCategoryRepository,

    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(
    payload: RequestGetVendorSubServiceCategoriesDTO
  ): Promise<ResponseGetVendorSubServiceCategoriesDTO> {
    const { vendorId, page, limit, search } = payload

    const vendorExists = await this._vendorRepository.findOne({
      userId: vendorId,
    })

    if (!vendorExists) {
      throw new CustomError(
        'Vendor does not exist. Invalid vendorId.',
        HTTP_STATUS.BAD_REQUEST
      )
    }

    const safePage = Math.max(Number(page), 1)
    const safeLimit = Math.max(Number(limit), 1)

    const response =
      await this._subServiceCategoryRepository.findAllDocumentsWithFilteration(
        safePage,
        safeLimit,
        search ?? '',
        { createdById: vendorId }
      )

    return GetVendorSubServiceCategoriesResponseMapper.toDTO(response)
  }
}
