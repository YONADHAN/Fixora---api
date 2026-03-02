import { inject, injectable } from 'tsyringe'
import { ISubServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { IServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'
import { GetAllSubServiceCategoriesBasedOnServiceCategoryIdResponseMapper } from '../../mappers/sub_service_category/get_sub_service_catergories_based_on_service_category_mapper'
import {
  RequestGetAllSubServiceCategoriesBasedOnServiceCategoryDTO,
  ResponseGetAllSubServiceCategoriesBasedOnServiceCategoryDTO,
} from '../../dtos/sub_service_category_dto'
import { IGetAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/get_all_sub_service_categories_based_on_service_category_id_usecase.interface'
import { Types } from 'mongoose'
@injectable()
export class GetAllSubServiceCategoriesBasedOnServiceCategoryId
  implements IGetAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase
{
  constructor(
    @inject('ISubServiceCategoryRepository')
    private _subServiceCategoryRepository: ISubServiceCategoryRepository,
    @inject('IServiceCategoryRepository')
    private _serviceCategoryRepository: IServiceCategoryRepository
  ) {}
  async execute(
    payload: RequestGetAllSubServiceCategoriesBasedOnServiceCategoryDTO
  ): Promise<ResponseGetAllSubServiceCategoriesBasedOnServiceCategoryDTO> {
    //console.log('Entering the usecase', payload.serviceCategoryId)
    const serviceCategoryExists = await this._serviceCategoryRepository.findOne(
      {
        serviceCategoryId: payload.serviceCategoryId,
      }
    )
    if (!serviceCategoryExists) {
      throw new CustomError(
        'Service Category Id Is Not Valid',
        HTTP_STATUS.BAD_REQUEST
      )
    }

    const page = payload.page
    const limit = payload.limit
    const search = payload.search

    //console.log('The payload :', payload)
    const serviceCategoryRef = new Types.ObjectId(serviceCategoryExists._id!)
    const response =
      await this._subServiceCategoryRepository.findAllDocumentsWithFilteration(
        page,
        limit,
        search ?? '',
        { serviceCategoryRef }
      )
    //console.log("doesn't have error in this saving data ", response)
    return GetAllSubServiceCategoriesBasedOnServiceCategoryIdResponseMapper.toDTO(
      response
    )
  }
}
