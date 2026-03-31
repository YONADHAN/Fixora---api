import { IWalletModel } from '../../../../interfaceAdapters/database/mongoDb/models/wallet_model'
import { IWalletEntity } from '../../../models/wallet_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface IWalletRepository extends IBaseRepository<
  IWalletModel,
  IWalletEntity
> {
  incrementBalance(
    walletId: string,
    amount: number,
    
  ): Promise<void>

  decrementBalance(
    walletId: string,
    amount: number,
   
  ): Promise<void>
}
