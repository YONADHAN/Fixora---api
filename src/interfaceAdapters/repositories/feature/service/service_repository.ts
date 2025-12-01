// import { injectable } from 'tsyringe'
// import {
//   ServiceModel,
//   IServiceModel,
// } from '../../../database/mongoDb/models/service_model'
// import { BaseRepository } from '../../base_repository'
// import { IServiceRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_repository.interface'

// @injectable()
// export class ServiceRepository
//   extends BaseRepository<IServiceModel>
//   implements IServiceRepository
// {
//   constructor() {
//     super(ServiceModel)
//   }
// }
// service_repository.ts
import { injectable } from 'tsyringe'
import {
  ServiceModel,
  IServiceModel,
} from '../../../database/mongoDb/models/service_model'
import { BaseRepository } from '../../base_repository'
import { IServiceRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { IServiceEntity } from '../../../../domain/models/service_entity'
import { FilterQuery } from 'mongoose'

@injectable()
export class ServiceRepository implements IServiceRepository {
  private baseRepo: BaseRepository<IServiceModel>

  constructor() {
    this.baseRepo = new BaseRepository<IServiceModel>(ServiceModel)
  }

  // Map Mongoose document to domain entity
  toEntity(model: IServiceModel | null): IServiceEntity | null {
    if (!model) return null

    return {
      _id: model._id.toString(),
      vendorRef: model.vendorRef.toString(),
      subServiceCategoryRef: model.subServiceCategoryRef.toString(),
      title: model.title,
      description: model.description,
      pricing: model.pricing,
      images: model.images,
      isActiveStatusByAdmin: model.isActiveStatusByAdmin,
      isActiveStatusByVendor: model.isActiveStatusByVendor,
      adminStatusNote: model.adminStatusNote,
      schedule: model.schedule,
      serviceHistoryRefs: model.serviceHistoryRefs.map((ref) => ref.toString()),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  private toEntityArray(models: IServiceModel[]): IServiceEntity[] {
    return models.map((model) => this.toEntity(model)!).filter(Boolean)
  }

  // Map entity to model for save/update operations
  private toModel(entity: Partial<IServiceEntity>): Partial<IServiceModel> {
    const model: any = { ...entity }

    // Convert string IDs back to ObjectId if needed
    // Mongoose will handle this automatically in most cases

    return model
  }

  async findOne(filter: any): Promise<IServiceEntity | null> {
    const result = await this.baseRepo.findOne(filter)
    return this.toEntity(result)
  }

  async save(data: Partial<IServiceEntity>): Promise<IServiceEntity> {
    const modelData = this.toModel(data)
    const result = await this.baseRepo.save(modelData)
    return this.toEntity(result)!
  }

  async delete(filter: any): Promise<IServiceEntity | null> {
    const result = await this.baseRepo.delete(filter)
    return this.toEntity(result)
  }

  async update(
    filter: any,
    updateData: Partial<IServiceEntity>
  ): Promise<IServiceEntity> {
    const modelData = this.toModel(updateData)
    const result = await this.baseRepo.update(filter, modelData)
    return this.toEntity(result)!
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<IServiceEntity[]> {
    const results = await this.baseRepo.findAll(page, limit, search)
    return this.toEntityArray(results)
  }

  async findAllDocuments(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    data: IServiceEntity[]
    currentPage: number
    totalPages: number
  }> {
    const result = await this.baseRepo.findAllDocuments(page, limit, search)
    return {
      data: this.toEntityArray(result.data),
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    }
  }

  async findAllDocumentsWithFilteration(
    page: number,
    limit: number,
    search?: string,
    extraFilters?: FilterQuery<IServiceEntity>
  ): Promise<{
    data: IServiceEntity[]
    currentPage: number
    totalPages: number
  }> {
    // Convert entity filters to model filters if needed
    const modelFilters = extraFilters as FilterQuery<IServiceModel>

    const result = await this.baseRepo.findAllDocumentsWithFilteration(
      page,
      limit,
      search,
      modelFilters
    )
    return {
      data: this.toEntityArray(result.data),
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    }
  }
}
