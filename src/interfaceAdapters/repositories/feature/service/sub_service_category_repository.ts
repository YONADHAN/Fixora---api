import { injectable } from 'tsyringe'
import {
  SubServiceCategoryModel,
  ISubServiceCategoryModel,
} from '../../../database/mongoDb/models/sub_service_category_model'

import { BaseRepository } from '../../base_repository'
import { ISubServiceCategoryRepository } from '../../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import {
  ISubServiceCategoryEntity,
  IServiceCategoryPopulated,
} from '../../../../domain/models/sub_service_category_entity'
import { Types } from 'mongoose'

/* ------------------------------------------------------------------
   TYPE GUARD FUNCTION — PLACE IT ABOVE CLASS (BEST PRACTICE)
-------------------------------------------------------------------*/
function isPopulated(ref: any): ref is IServiceCategoryPopulated {
  return (
    ref &&
    typeof ref === 'object' &&
    '_id' in ref &&
    'name' in ref &&
    'serviceCategoryId' in ref
  )
}

/* ------------------------------------------------------------------
   REPOSITORY CLASS
-------------------------------------------------------------------*/
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
    let serviceCategory = undefined

    if (isPopulated(model.serviceCategoryRef)) {
      serviceCategory = {
        _id: model.serviceCategoryRef._id.toString(),
        name: model.serviceCategoryRef.name,
        serviceCategoryId: model.serviceCategoryRef.serviceCategoryId,
      }
    }

    return {
      _id: model._id,
      subServiceCategoryId: model.subServiceCategoryId,

      serviceCategoryRef: model.serviceCategoryRef.toString(),
      serviceCategory,

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

  protected toModel(
    entity: Partial<ISubServiceCategoryEntity>
  ): Partial<ISubServiceCategoryModel> {
    let serviceCategoryRef: any = undefined

    if (entity.serviceCategoryRef) {
      if (typeof entity.serviceCategoryRef === 'string') {
        serviceCategoryRef = new Types.ObjectId(entity.serviceCategoryRef)
      } else if (typeof entity.serviceCategoryRef === 'object') {
        serviceCategoryRef = undefined
      }
    }

    return {
      subServiceCategoryId: entity.subServiceCategoryId,
      serviceCategoryRef,
      name: entity.name,
      description: entity.description,
      bannerImage: entity.bannerImage,
      isActive: entity.isActive,
      verification: entity.verification,
      createdById: entity.createdById,
      createdByRole: entity.createdByRole,
    }
  }
}
