import { injectable } from 'tsyringe'
import {
  SubServiceCategoryModel,
  ISubServiceCategoryModel,
} from '../../../database/mongoDb/models/sub_service_category_model'

import { BaseRepository } from '../../base_repository'
import { ISubServiceCategoryRepository } from '../../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { ISubServiceCategoryEntity } from '../../../../domain/models/sub_service_category_entity'

@injectable()
export class SubServiceCategoryRepository
  extends BaseRepository<ISubServiceCategoryModel, ISubServiceCategoryEntity>
  implements ISubServiceCategoryRepository
{
  constructor() {
    super(SubServiceCategoryModel)
  }
  protected toEntity(
    model: ISubServiceCategoryModel
  ): ISubServiceCategoryEntity {
    return {
      _id: model._id,
      subServiceCategoryId: model.subServiceCategoryId,
      serviceCategoryId: model.serviceCategoryId,
      serviceCategoryName: model.serviceCategoryName,
      name: model.name,
      description: model.description,
      bannerImage: model.bannerImage,
      isActive: model.isActive,
      verification: model.verification,
      createdById: model.createdById,
      createdByRole: model.createdByRole,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
