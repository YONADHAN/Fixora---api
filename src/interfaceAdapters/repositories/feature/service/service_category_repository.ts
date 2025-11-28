import { injectable } from 'tsyringe'
import {
  ServiceCategoryModel,
  IServiceCategoryModel,
} from '../../../database/mongoDb/models/service_category_model'
import { BaseRepository } from '../../base_repository'
import { IServiceCategoryRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'

@injectable()
export class ServiceCategoryRepository
  extends BaseRepository<IServiceCategoryModel>
  implements IServiceCategoryRepository
{
  constructor() {
    super(ServiceCategoryModel)
  }

  async findActiveCategories() {
    return await this.model.find({ isActive: true }).lean()
  }
}
