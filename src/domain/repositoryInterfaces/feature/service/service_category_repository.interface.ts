import { IServiceCategoryEntity } from '../../../models/service_category_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface IServiceCategoryRepository
  extends IBaseRepository<IServiceCategoryEntity> {
  findActiveCategories(): Promise<IServiceCategoryEntity[]>
}
