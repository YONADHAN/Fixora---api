import {
  RequestGetAllSubServiceCategoriesBasedOnServiceCategoryDTO,
  ResponseGetAllSubServiceCategoriesBasedOnServiceCategoryDTO,
} from '../../../application/dtos/sub_service_category_dto'

export interface IGetAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase {
  execute(
    payload: RequestGetAllSubServiceCategoriesBasedOnServiceCategoryDTO
  ): Promise<ResponseGetAllSubServiceCategoriesBasedOnServiceCategoryDTO>
}
