import { injectable } from 'tsyringe'
import {
  SubServiceCategoryModel,
  ISubServiceCategoryModel,
} from '../../../database/mongoDb/models/sub_service_category_model'

import { BaseRepository } from '../../base_repository'
import { ISubServiceCategoryRepository } from '../../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'

@injectable()
export class SubServiceCategoryRepository
  extends BaseRepository<ISubServiceCategoryModel>
  implements ISubServiceCategoryRepository
{
  constructor() {
    super(SubServiceCategoryModel)
  }
}
