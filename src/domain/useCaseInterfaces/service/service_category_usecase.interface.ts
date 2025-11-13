import { IServiceCategoryEntity } from '../../models/service_category_entity'

export interface IGetAllServiceCategoryUseCase {
  execute(params: {
    page: number
    limit: number
    search: string
  }): Promise<IServiceCategoryEntity[]>
}
