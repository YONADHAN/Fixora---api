import { IServiceCategoryEntity } from '../../../models/service_category_entity'

export interface IAIMainServiceCategoryRepository {
  findServiceCategories(): Promise<IServiceCategoryEntity[]>
}
