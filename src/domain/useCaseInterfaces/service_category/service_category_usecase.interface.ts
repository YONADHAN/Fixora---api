import { ResponseServiceCategoryDTO } from '../../../application/dtos/service_category_dto'

export interface IGetAllServiceCategoryUseCase {
  execute(params: {
    page: number
    limit: number
    search: string
  }): Promise<ResponseServiceCategoryDTO>
}
