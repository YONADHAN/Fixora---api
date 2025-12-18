import { Types } from 'mongoose'
import { TRole } from '../../../../shared/constants'

export interface WalletMongoBase {
  _id: Types.ObjectId

  walletId: string

  userRef: Types.ObjectId
  userType: TRole

  currency: string
  isActive: boolean

  createdAt: Date
  updatedAt: Date
}
