import { injectable } from 'tsyringe'
import {
  WalletModel,
  IWalletModel,
} from '../../../database/mongoDb/models/wallet_model'
import { BaseRepository } from '../../base_repository'
import { IWalletEntity } from '../../../../domain/models/wallet_entity'
import { Types } from 'mongoose'
import { WalletMongoBase } from '../../../database/mongoDb/types/wallet_mongo_base'
import { IWalletRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'
@injectable()
export class WalletRepository
  extends BaseRepository<IWalletModel, IWalletEntity>
  implements IWalletRepository
{
  constructor() {
    super(WalletModel)
  }

  protected toModel(entity: Partial<IWalletEntity>): Partial<IWalletModel> {
    return {
      walletId: entity.walletId,
      userRef: entity.userRef ? new Types.ObjectId(entity.userRef) : undefined,
      userType: entity.userType,
      currency: entity.currency,
      isActive: entity.isActive,
    }
  }

  protected toEntity(model: WalletMongoBase): IWalletEntity {
    return {
      _id: model._id.toString(),
      walletId: model.walletId,
      userRef: model.userRef.toString(),
      userType: model.userType,
      currency: model.currency,
      isActive: model.isActive,
      balance: model.balance,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  async incrementBalance(
    walletId: string,
    amount: number,
    session?: any,
  ): Promise<void> {
    await this.model.updateOne(
      { _id: walletId },
      { $inc: { balance: amount } },
      { session },
    )
  }

  async decrementBalance(
    walletId: string,
    amount: number,
    session?: any,
  ): Promise<void> {
    await this.model.updateOne(
      { _id: walletId },
      { $inc: { balance: -amount } },
      { session },
    )
  }
}
