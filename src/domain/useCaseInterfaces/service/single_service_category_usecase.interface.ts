import { ServiceCategoryResponseDTO } from '../../../application/dtos/admin/service_category_dto'

export interface IGetSingleServiceCategoryUseCase {
  execute(params: {
    categoryId: string
  }): Promise<ServiceCategoryResponseDTO | null>
}
