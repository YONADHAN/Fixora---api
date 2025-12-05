import { injectable } from 'tsyringe'
import {
  ServiceCategoryModel,
  IServiceCategoryModel,
} from '../../../database/mongoDb/models/service_category_model'
import { BaseRepository } from '../../base_repository'
import { IServiceCategoryRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'
import { IServiceCategoryEntity } from '../../../../domain/models/service_category_entity'

@injectable()
export class ServiceCategoryRepository
  extends BaseRepository<IServiceCategoryModel, IServiceCategoryEntity>
  implements IServiceCategoryRepository
{
  constructor() {
    super(ServiceCategoryModel)
  }

  protected toEntity(model: IServiceCategoryModel): IServiceCategoryEntity {
    return {
      _id: model._id.toString(),
      serviceCategoryId: model.serviceCategoryId,
      name: model.name,
      description: model.description,
      bannerImage: model.bannerImage,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  protected toModel(
    entity: Partial<IServiceCategoryEntity>
  ): Partial<IServiceCategoryModel> {
    return {
      serviceCategoryId: entity.serviceCategoryId,
      name: entity.name,
      description: entity.description,
      bannerImage: entity.bannerImage,
      isActive: entity.isActive,
    }
  }
  async findActiveCategories(): Promise<IServiceCategoryEntity[]> {
    const result = await this.model.find({ isActive: true }).lean()
    return result.map((m) =>
      this.toEntity(m as unknown as IServiceCategoryModel)
    )
  }
}
