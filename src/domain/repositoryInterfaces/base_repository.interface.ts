// import { FilterQuery, UpdateResult } from 'mongoose'

// export interface IBaseRepository<T> {
//   findOne(filter: any): Promise<T | null>
//   save(data: Partial<T>): Promise<T>
//   delete(filter: any): Promise<T | null>
//   update(filter: any, updateData: Partial<T>): Promise<T>
//   findAll(page: number, limit: number, search?: string): Promise<T[]>
//   findAllDocuments(
//     page: number,
//     limit: number,
//     search?: string
//   ): Promise<{ data: T[]; currentPage: number; totalPages: number }>
//   findAllDocumentsWithFilteration(
//     page: number,
//     limit: number,
//     search?: string,
//     extraFilters?: FilterQuery<T>
//   ): Promise<{ data: T[]; currentPage: number; totalPages: number }>
// }
// //✅
// import { FilterQuery } from 'mongoose'

// export interface IBaseRepository<TModel, TEntity = TModel> {
//   findOne(filter: FilterQuery<TModel>): Promise<TEntity | null>
//   save(data: Partial<TModel>): Promise<TEntity>
//   delete(filter: FilterQuery<TModel>): Promise<TEntity | null>
//   update(
//     filter: FilterQuery<TModel>,
//     updateData: Partial<TModel>
//   ): Promise<TEntity | null>

//   findAll(page: number, limit: number, search?: string): Promise<TEntity[]>

//   findAllDocuments(
//     page: number,
//     limit: number,
//     search?: string
//   ): Promise<{
//     data: TEntity[]
//     currentPage: number
//     totalPages: number
//   }>

//   findAllDocumentsWithFilteration(
//     page: number,
//     limit: number,
//     search?: string,
//     extraFilters?: FilterQuery<TModel>
//   ): Promise<{
//     data: TEntity[]
//     currentPage: number
//     totalPages: number
//   }>
// }
import { FilterQuery } from 'mongoose'

export interface IBaseRepository<TModel, TEntity = TModel> {
  findOne(filter: FilterQuery<TModel>): Promise<TEntity | null>

  save(data: Partial<TEntity>): Promise<TEntity>

  delete(filter: FilterQuery<TModel>): Promise<TEntity | null>

  update(
    filter: FilterQuery<TModel>,
    updateData: Partial<TEntity>
  ): Promise<TEntity | null>

  findAll(page: number, limit: number, search?: string): Promise<TEntity[]>

  findAllDocuments(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    data: TEntity[]
    currentPage: number
    totalPages: number
  }>

  findAllDocumentsWithFilteration(
    page: number,
    limit: number,
    search?: string,
    extraFilters?: FilterQuery<TModel>
  ): Promise<{
    data: TEntity[]
    currentPage: number
    totalPages: number
  }>
}
