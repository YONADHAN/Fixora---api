import { IBaseRepository } from '../../base_repository.interface'
import { IWalletTransactionEntity } from '../../../models/wallet_transaction_entity'
import { IWalletTransactionModel } from '../../../../interfaceAdapters/database/mongoDb/models/wallet_transaction_model'
import { FilterQuery } from 'mongoose'

export interface IWalletTransactionRepository extends IBaseRepository<
  IWalletTransactionModel,
  IWalletTransactionEntity
> {
  findAllDocsWithoutPagination(
    filter:  FilterQuery<IWalletTransactionModel>,
    sortOptions?: {
      sortBy: 'amount' | 'createdAt' | 'type'
      order: 'asc' | 'desc'
    },
  ): Promise<IWalletTransactionEntity[]>

  findWithPagination(
    filter:  FilterQuery<IWalletTransactionModel>,
    options: {
      page: number
      limit: number
      sortBy?: 'amount' | 'createdAt' | 'type'
      order?: 'asc' | 'desc'
      search?: string
    },
  ): Promise<{
    data: IWalletTransactionEntity[]
    totalCount: number
  }>
}
