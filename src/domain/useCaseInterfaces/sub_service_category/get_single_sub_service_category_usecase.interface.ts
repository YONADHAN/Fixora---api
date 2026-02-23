import {
  RequestGetSingleSubServiceCategoryDTO,
  ResponseGetSingleSubServiceCategoryDTO,
} from '../../../application/dtos/sub_service_category_dto'

export interface IGetSingleSubServiceCategoryUseCase {
  execute(
    subServiceCategoryId: RequestGetSingleSubServiceCategoryDTO
  ): Promise<ResponseGetSingleSubServiceCategoryDTO>
}
