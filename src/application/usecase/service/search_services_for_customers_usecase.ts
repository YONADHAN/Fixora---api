import { inject, injectable } from 'tsyringe'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { ISubServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { SearchServicesForCustomersResponseMapper } from '../../mappers/service/search_services_for_customer_mapper'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import {
  RequestSearchServicesForCustomerDTO,
  ResponseSearchServicesForCustomerDTO,
} from '../../dtos/service_dto'
import { ISearchServicesForCustomersUseCase } from '../../../domain/useCaseInterfaces/service/search_services_for_customers_usecase.interface'

@injectable()
export class SearchServicesForCustomersUseCase
  implements ISearchServicesForCustomersUseCase {
  constructor(
    @inject('IServiceRepository')
    private _serviceRepository: IServiceRepository,
    @inject('ISubServiceCategoryRepository')
    private _subServiceCategoryRepo: ISubServiceCategoryRepository,
    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository
  ) { }

  async execute(
    dto: RequestSearchServicesForCustomerDTO
  ): Promise<ResponseSearchServicesForCustomerDTO> {
    const filter: any = {
      isActiveStatusByAdmin: true,
      isActiveStatusByVendor: true,
    }

    const subCategory = await this._subServiceCategoryRepo.findOne({
      subServiceCategoryId: dto.subServiceCategoryId,
    })

    if (!subCategory) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.BAD_REQUEST
      )
    }

    filter.subServiceCategoryRef = subCategory._id

    if (dto.minPrice || dto.maxPrice) {
      filter['pricing.pricePerSlot'] = {}
      if (dto.minPrice) filter['pricing.pricePerSlot'].$gte = dto.minPrice
      if (dto.maxPrice) filter['pricing.pricePerSlot'].$lte = dto.maxPrice
    }

    if (dto.availableFrom && dto.availableTo) {
      filter['schedule.visibilityStartDate'] = { $lte: dto.availableFrom }
      filter['schedule.visibilityEndDate'] = { $gte: dto.availableTo }
    }
    // GEO-LOCATION FILTER
    if (dto.latitude && dto.longitude) {
      const radiusInKm = dto.radius ? Number(dto.radius) : 50 // configure radius or pass from dto

      const nearestVendors = await this._vendorRepository.findNearestVendors(
        Number(dto.latitude),
        Number(dto.longitude),
        radiusInKm
      )

      const vendorIds = nearestVendors.map(v => v._id)

      filter.vendorRef = { $in: vendorIds }
    }



    const response =
      await this._serviceRepository.findAllDocumentsWithFilterationAndPopulate(
        dto.page,
        dto.limit,
        dto.search,
        filter,
        ['subServiceCategoryRef', 'vendorRef']
      )
    return SearchServicesForCustomersResponseMapper.toDTO(response)
  }
}
