import { injectable } from 'tsyringe'
import { FilterQuery, SortOrder, Types } from 'mongoose'

import { BaseRepository } from '../../base_repository'
import {
  WalletTransactionModel,
  IWalletTransactionModel,
} from '../../../database/mongoDb/models/wallet_transaction_model'

import { IWalletTransactionRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'

import { WalletTransactionMongoBase } from '../../../database/mongoDb/types/wallet_transaction_mongo_base'
import { IWalletTransactionEntity } from '../../../../domain/models/wallet_transaction_entity'

@injectable()
export class WalletTransactionRepository
  extends BaseRepository<IWalletTransactionModel, IWalletTransactionEntity>
  implements IWalletTransactionRepository {
  constructor() {
    super(WalletTransactionModel)
  }

  async findWithPagination(
    filter: FilterQuery<IWalletTransactionModel>,
    options: {
      page: number
      limit: number
      sortBy?: 'amount' | 'createdAt' | 'type'
      order?: 'asc' | 'desc'
      search?: string
    },
  ): Promise<{ data: IWalletTransactionEntity[]; totalCount: number }> {
    const { page, limit, sortBy, order, search } = options

    const skip = (page - 1) * limit

    const sort: Record<string, SortOrder> = {}
    if (sortBy) {
      sort[sortBy] = order === 'asc' ? 1 : -1
    } else {
      sort.createdAt = -1
    }

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
      ]
    }

    const [data, totalCount] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).lean<IWalletTransactionModel[]>(),
      this.model.countDocuments(filter),
    ])
console.log("The data first : => ",data)
    return {
      data: this.toEntityArray(data),
      totalCount,
    }
  }

  async findAllDocsWithoutPagination(
    filter: FilterQuery<IWalletTransactionModel>,
    sortOptions?: {
      sortBy: 'amount' | 'createdAt' | 'type'
      order: 'asc' | 'desc'
    },
  ): Promise<IWalletTransactionEntity[]> {
    const sort: Record<string, SortOrder> = {}
    if (sortOptions) {
      sort[sortOptions.sortBy] = sortOptions.order === 'asc' ? 1 : -1
    } else {
      sort.createdAt = -1
    }

    const result = await this.model.find(filter).sort(sort).lean<IWalletTransactionModel[]>()
    return this.toEntityArray(result)
  }

  protected toModel(
    entity: Partial<IWalletTransactionEntity>,
  ): Partial<IWalletTransactionModel> {
    return {
      transactionId: entity.transactionId,

      walletRef: entity.walletRef
        ? new Types.ObjectId(entity.walletRef)
        : undefined,

      userRef: entity.userRef ? new Types.ObjectId(entity.userRef) : undefined,

      type: entity.type,
      source: entity.source,

      amount: entity.amount,
      currency: entity.currency,

      description: entity.description,

      bookingRef: entity.bookingRef
        ? new Types.ObjectId(entity.bookingRef)
        : undefined,

      bookingHoldRef: entity.bookingHoldRef
        ? new Types.ObjectId(entity.bookingHoldRef)
        : undefined,

      paymentRef: entity.paymentRef
        ? new Types.ObjectId(entity.paymentRef)
        : undefined,

      stripePaymentIntentId: entity.stripePaymentIntentId,
    }
  }

  protected toEntity(
    model: WalletTransactionMongoBase,
  ): IWalletTransactionEntity {
    return {
      _id: model._id.toString(),

      transactionId: model.transactionId,

      walletRef: model.walletRef.toString(),
      userRef: model.userRef.toString(),

      type: model.type,
      source: model.source,

      amount: model.amount,
      currency: model.currency,

      description: model.description,

      bookingRef: model.bookingRef?.toString(),
      bookingHoldRef: model.bookingHoldRef?.toString(),
      paymentRef: model.paymentRef?.toString(),

      stripePaymentIntentId: model.stripePaymentIntentId,

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
