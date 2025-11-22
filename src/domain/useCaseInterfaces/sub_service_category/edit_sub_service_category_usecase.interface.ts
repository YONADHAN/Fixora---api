import {
  RequestEditSubServiceCategoriesDTO,
  ResponseEditSubServiceCategoriesDTO,
} from '../../../application/dtos/sub_service_category_dto'

export interface IEditSubServiceCategoryUseCase {
  execute(
    payload: RequestEditSubServiceCategoriesDTO
  ): Promise<ResponseEditSubServiceCategoriesDTO>
}
