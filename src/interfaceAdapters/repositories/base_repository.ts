// import { Model, FilterQuery } from 'mongoose'
// import { IBaseRepository } from '../../domain/repositoryInterfaces/base_repository.interface'

// export class BaseRepository<T> implements IBaseRepository<T> {
//   constructor(protected model: Model<T>) {}

//   async findOne(filter: FilterQuery<T>) {
//     return this.model.findOne(filter).lean() as Promise<T>
//   }

//   async save(data: Partial<T>) {
//     return this.model.create(data)
//   }

//   async delete(filter: FilterQuery<T>) {
//     return this.model.findOneAndDelete(filter).lean() as Promise<T>
//   }

//   async update(filter: FilterQuery<T>, updateData: Partial<T>) {
//     return this.model
//       .findOneAndUpdate(filter, { $set: updateData }, { new: true })
//       .lean() as Promise<T>
//   }

//   async findAll(
//     page: number,
//     limit: number,
//     search: string = ''
//   ): Promise<T[]> {
//     const filter: FilterQuery<T> = search
//       ? ({
//           name: { $regex: search, $options: 'i' },
//         } as FilterQuery<T>)
//       : {}

//     const results = await this.model
//       .find(filter)
//       .limit(limit)
//       .skip((page - 1) * limit)
//       .lean()

//     return results as unknown as T[]
//   }

//   async findAllDocuments(
//     page: number,
//     limit: number,
//     search: string = ''
//   ): Promise<{ data: T[]; currentPage: number; totalPages: number }> {
//     const filter: FilterQuery<T> = search
//       ? ({
//           name: { $regex: search, $options: 'i' },
//         } as FilterQuery<T>)
//       : {}

//     const totalItems = await this.model.countDocuments(filter)

//     const results = await this.model
//       .find(filter)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ createdAt: -1 })
//       .lean()

//     return {
//       data: results as T[],
//       currentPage: page,
//       totalPages: Math.ceil(totalItems / limit),
//     }
//   }
//   async findAllDocumentsWithFilteration(
//     page: number,
//     limit: number,
//     search: string = '',
//     extraFilters: FilterQuery<T> = {}
//   ): Promise<{ data: T[]; currentPage: number; totalPages: number }> {
//     const filter: FilterQuery<T> = {
//       ...extraFilters,
//       ...(search ? { name: { $regex: search, $options: 'i' } } : {}),
//     }

//     const totalItems = await this.model.countDocuments(filter)

//     const results = await this.model
//       .find(filter)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ createdAt: -1 })
//       .lean()

//     return {
//       data: results as T[],
//       currentPage: page,
//       totalPages: Math.ceil(totalItems / limit),
//     }
//   }
// }
// //✅
// import { Model, FilterQuery } from 'mongoose'
// import { IBaseRepository } from '../../domain/repositoryInterfaces/base_repository.interface'

// export abstract class BaseRepository<TModel, TEntity>
//   implements IBaseRepository<TModel, TEntity>
// {
//   constructor(protected model: Model<TModel>) {}

//   protected abstract toEntity(model: TModel): TEntity

//   protected toEntityArray(models: TModel[]): TEntity[] {
//     return models.map((m) => this.toEntity(m))
//   }

//   async findOne(filter: FilterQuery<TModel>): Promise<TEntity | null> {
//     const result = await this.model.findOne(filter).lean()
//     return result ? this.toEntity(result as TModel) : null
//   }

//   async save(data: Partial<TModel>): Promise<TEntity> {
//     const doc = await this.model.create(data)
//     const obj = doc.toObject() as TModel
//     return this.toEntity(obj)
//   }

//   async delete(filter: FilterQuery<TModel>): Promise<TEntity | null> {
//     const result = await this.model.findOneAndDelete(filter).lean()
//     return result ? this.toEntity(result as TModel) : null
//   }

//   async update(
//     filter: FilterQuery<TModel>,
//     updateData: Partial<TModel>
//   ): Promise<TEntity | null> {
//     const result = await this.model
//       .findOneAndUpdate(filter, { $set: updateData }, { new: true })
//       .lean()

//     return result ? this.toEntity(result as TModel) : null
//   }

//   async findAll(
//     page: number,
//     limit: number,
//     search: string = ''
//   ): Promise<TEntity[]> {
//     const filter = search
//       ? ({ name: { $regex: search, $options: 'i' } } as FilterQuery<TModel>)
//       : {}

//     const results = await this.model
//       .find(filter)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .lean()

//     return this.toEntityArray(results as TModel[])
//   }

//   async findAllDocuments(
//     page: number,
//     limit: number,
//     search: string = ''
//   ): Promise<{
//     data: TEntity[]
//     currentPage: number
//     totalPages: number
//   }> {
//     const filter = search
//       ? ({ name: { $regex: search, $options: 'i' } } as FilterQuery<TModel>)
//       : {}

//     const total = await this.model.countDocuments(filter)

//     const result = await this.model
//       .find(filter)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ createdAt: -1 })
//       .lean()

//     return {
//       data: this.toEntityArray(result as TModel[]),
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//     }
//   }

//   async findAllDocumentsWithFilteration(
//     page: number,
//     limit: number,
//     search: string = '',
//     extraFilters: FilterQuery<TModel> = {}
//   ): Promise<{
//     data: TEntity[]
//     currentPage: number
//     totalPages: number
//   }> {
//     const filter: FilterQuery<TModel> = {
//       ...extraFilters,
//       ...(search ? { name: { $regex: search, $options: 'i' } } : {}),
//     }

//     const total = await this.model.countDocuments(filter)

//     const result = await this.model
//       .find(filter)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ createdAt: -1 })
//       .lean()

//     return {
//       data: this.toEntityArray(result as TModel[]),
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//     }
//   }
// }

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
