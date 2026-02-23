import { inject, injectable } from 'tsyringe'
import {
  RequestGetAllSubServiceCategoriesDTO,
  ResponseGetAllSubServiceCategoriesDTO,
} from '../../dtos/sub_service_category_dto'
import { IGetAllSubServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/get_all_sub_service_category_usecase.interface'
import { ISubServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { GetAllSubServiceCategoriesResponseMapper } from '../../mappers/sub_service_category/get_all_sub_service_category_mapper'

@injectable()
export class GetAllSubServiceCategoryUseCase
  implements IGetAllSubServiceCategoryUseCase
{
  constructor(
    @inject('ISubServiceCategoryRepository')
    private _subServiceCategoryRepository: ISubServiceCategoryRepository
  ) {}
  async execute(
    payload: RequestGetAllSubServiceCategoriesDTO
  ): Promise<ResponseGetAllSubServiceCategoriesDTO> {
    const { page, limit, search } = payload
    // console.log('payload', payload)
    const rawResponse =
      await this._subServiceCategoryRepository.findAllDocumentsWithFilterationAndPopulate(
        page,
        limit,
        search,
        {},
        { path: 'serviceCategoryRef', select: 'name serviceCategoryId' }
      )
    //console.log('rawResponse', rawResponse)
    return GetAllSubServiceCategoriesResponseMapper.toDTO(rawResponse)
  }
}
