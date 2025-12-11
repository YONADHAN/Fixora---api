import { inject, injectable } from 'tsyringe'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
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
  implements ISearchServicesForCustomersUseCase
{
  constructor(
    @inject('IServiceRepository')
    private _serviceRepository: IServiceRepository,
    @inject('ISubServiceCategoryRepository')
    private _subServiceCategoryRepo: ISubServiceCategoryRepository
  ) {}

  async execute(
    dto: RequestSearchServicesForCustomerDTO
  ): Promise<ResponseSearchServicesForCustomerDTO> {
    console.log('The dto of search service customer usecase : ', dto)
    const filter: any = {
      isActiveStatusByAdmin: true,
      isActiveStatusByVendor: true,
    }
    console.log('filter 0', filter)
    const subCategory = await this._subServiceCategoryRepo.findOne({
      subServiceCategoryId: dto.subServiceCategoryId,
    })
    console.log('sub service category ', subCategory)
    if (!subCategory) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.BAD_REQUEST
      )
    }

    filter.subServiceCategoryRef = subCategory._id

    console.log('filter 1', filter)
    // PRICE FILTER
    if (dto.minPrice || dto.maxPrice) {
      filter['pricing.pricePerSlot'] = {}
      if (dto.minPrice) filter['pricing.pricePerSlot'].$gte = dto.minPrice
      if (dto.maxPrice) filter['pricing.pricePerSlot'].$lte = dto.maxPrice
    }
    console.log('filter 2', filter)
    // RECURRENCE FILTER
    if (dto.recurrenceType) {
      filter['schedule.recurrenceType'] = dto.recurrenceType
    }
    console.log('filter 3', filter)
    // WEEKLY DAYS FILTER
    if (dto.weeklyDays?.length) {
      filter['schedule.weeklyWorkingDays'] = { $in: dto.weeklyDays }
    }
    console.log('filter 4', filter)
    // AVAILABLE DATE FILTER (visibilityStartDate → visibilityEndDate)
    if (dto.availableFrom && dto.availableTo) {
      filter['schedule.visibilityStartDate'] = { $lte: dto.availableFrom }
      filter['schedule.visibilityEndDate'] = { $gte: dto.availableTo }
    }
    console.log('filter 5', filter)
    // WORKING HOURS FILTER — MUST USE $elemMatch ❗❗
    if (dto.workStartTime && dto.workEndTime) {
      filter['schedule.dailyWorkingWindows'] = {
        $elemMatch: {
          startTime: { $lte: dto.workStartTime },
          endTime: { $gte: dto.workEndTime },
        },
      }
    }

    console.log('The filter in usecase : ', filter)
    // ⭐ SEARCH IS NOT ADDED HERE because repository handles it already.

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
