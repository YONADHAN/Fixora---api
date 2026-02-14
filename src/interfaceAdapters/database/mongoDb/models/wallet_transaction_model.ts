import { Document, model, Types } from 'mongoose'

import { WalletTransactionSchema } from '../schemas/wallet_transaction_schema'
import { WalletTransactionMongoBase } from '../types/wallet_transaction_mongo_base'

export interface IWalletTransactionModel
  extends WalletTransactionMongoBase,
    Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const WalletTransactionModel = model<IWalletTransactionModel>(
  'WalletTransaction',
  WalletTransactionSchema
)
