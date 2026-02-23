import {
  RequestGetAllSubServiceCategoriesDTO,
  ResponseGetAllSubServiceCategoriesDTO,
} from '../../../application/dtos/sub_service_category_dto'

export interface IGetAllSubServiceCategoryUseCase {
  execute(
    payload: RequestGetAllSubServiceCategoriesDTO
  ): Promise<ResponseGetAllSubServiceCategoriesDTO>
}
