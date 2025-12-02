import { Model, FilterQuery } from 'mongoose'
import { IBaseRepository } from '../../domain/repositoryInterfaces/base_repository.interface'

export abstract class BaseRepository<TModel, TEntity>
  implements IBaseRepository<TModel, TEntity>
{
  constructor(protected model: Model<TModel>) {}

  // Required mappers
  protected abstract toEntity(model: TModel): TEntity
  protected abstract toModel(entity: Partial<TEntity>): Partial<TModel>

  protected toEntityArray(models: TModel[]): TEntity[] {
    return models.map((m) => this.toEntity(m))
  }

  async findOne(filter: FilterQuery<TModel>): Promise<TEntity | null> {
    const result = await this.model.findOne(filter).lean()
    return result ? this.toEntity(result as TModel) : null
  }

  async save(data: Partial<TEntity>): Promise<TEntity> {
    const modelData = this.toModel(data)
    const doc = await this.model.create(modelData)
    return this.toEntity(doc.toObject() as TModel)
  }

  async delete(filter: FilterQuery<TModel>): Promise<TEntity | null> {
    const result = await this.model.findOneAndDelete(filter).lean()
    return result ? this.toEntity(result as TModel) : null
  }

  async update(
    filter: FilterQuery<TModel>,
    updateData: Partial<TEntity>
  ): Promise<TEntity | null> {
    const modelData = this.toModel(updateData)

    const result = await this.model
      .findOneAndUpdate(filter, { $set: modelData }, { new: true })
      .lean()

    return result ? this.toEntity(result as TModel) : null
  }

  async findAll(
    page: number,
    limit: number,
    search: string = ''
  ): Promise<TEntity[]> {
    const filter = search
      ? ({ name: { $regex: search, $options: 'i' } } as FilterQuery<TModel>)
      : {}

    const results = await this.model
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    return this.toEntityArray(results as TModel[])
  }

  async findAllDocuments(page: number, limit: number, search: string = '') {
    const filter = search
      ? ({ name: { $regex: search, $options: 'i' } } as FilterQuery<TModel>)
      : {}

    const total = await this.model.countDocuments(filter)

    const results = await this.model
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    return {
      data: this.toEntityArray(results as TModel[]),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findAllDocumentsWithFilteration(
    page: number,
    limit: number,
    search: string = '',
    extraFilters: FilterQuery<TModel> = {}
  ) {
    const filter: FilterQuery<TModel> = {
      ...extraFilters,
      ...(search ? { name: { $regex: search, $options: 'i' } } : {}),
    }

    const total = await this.model.countDocuments(filter)

    const results = await this.model
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    return {
      data: this.toEntityArray(results as TModel[]),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    }
  }
}
