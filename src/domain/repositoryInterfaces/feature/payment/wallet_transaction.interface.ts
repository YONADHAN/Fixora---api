import { IBaseRepository } from '../../base_repository.interface'
import { IWalletTransactionEntity } from '../../../models/wallet_transaction_entity'
import { IWalletTransactionModel } from '../../../../interfaceAdapters/database/mongoDb/models/wallet_transaction_model'

export interface IWalletTransactionRepository
  extends IBaseRepository<IWalletTransactionModel, IWalletTransactionEntity> {
  findAllDocsWithoutPagination(
    filter: any,
    sortOptions?: {
      sortBy: 'amount' | 'createdAt' | 'type'
      order: 'asc' | 'desc'
    }
  ): Promise<IWalletTransactionEntity[]>
}
