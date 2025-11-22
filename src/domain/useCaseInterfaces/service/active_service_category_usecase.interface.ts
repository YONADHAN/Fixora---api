import { ResponseActiveServiceCategoryDTO } from '../../../application/dtos/service_category_dto'

export interface IGetActiveServiceCategoryUseCase {
  execute(): Promise<ResponseActiveServiceCategoryDTO>
}
