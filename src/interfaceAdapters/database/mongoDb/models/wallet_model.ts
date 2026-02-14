import { Document, model, Types } from 'mongoose'
import { WalletSchema } from '../schemas/wallet_schema'
import { WalletMongoBase } from '../types/wallet_mongo_base'

export interface IWalletModel extends WalletMongoBase, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const WalletModel = model<IWalletModel>('Wallet', WalletSchema)
