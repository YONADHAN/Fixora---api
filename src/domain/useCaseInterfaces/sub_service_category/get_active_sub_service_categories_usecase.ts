import { ResponseGetActiveSubServiceCategoriesDTO } from '../../../application/dtos/sub_service_category_dto'

export interface IGetActiveSubServiceCategoriesUseCase {
  execute(): Promise<ResponseGetActiveSubServiceCategoriesDTO>
}
