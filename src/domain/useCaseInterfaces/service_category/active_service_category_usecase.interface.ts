import { ResponseActiveServiceCategoriesDTO } from '../../../application/dtos/service_category_dto'

export interface IGetActiveServiceCategoriesUseCase {
  execute(): Promise<ResponseActiveServiceCategoriesDTO>
}
