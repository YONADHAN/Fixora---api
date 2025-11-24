import { RequestToggleBlockStatusOfSubServiceCategoryDTO } from '../../../application/dtos/sub_service_category_dto'

export interface IToggleBlockStatusOfSubServiceCategoryUseCase {
  execute(
    payload: RequestToggleBlockStatusOfSubServiceCategoryDTO
  ): Promise<void>
}
