import { IServiceEntity } from '../../../models/service_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface IServiceRepository extends IBaseRepository<IServiceEntity> {
  findByCategory(categoryId: string): Promise<IServiceEntity[]>
}
