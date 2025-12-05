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

  findOneAndPopulate(
    filter: FilterQuery<TModel>,
    populateFields: string | string[] | object | object[]
  ): Promise<TEntity | null>

  findAllDocumentsWithFilterationAndPopulate(
    page: number,
    limit: number,
    search: string,
    extraFilters: FilterQuery<TModel>,
    populateFields?: string | string[] | object | object[]
  ): Promise<{ data: TEntity[]; currentPage: number; totalPages: number }>
}
