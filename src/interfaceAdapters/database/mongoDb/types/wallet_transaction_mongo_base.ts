import { Types } from 'mongoose'
import {
  WalletTransactionSource,
  WalletTransactionType,
} from '../../../../shared/constants'

export interface WalletTransactionMongoBase {
  _id: Types.ObjectId

  transactionId: string

  walletRef: Types.ObjectId
  userRef: Types.ObjectId

  type: WalletTransactionType

  amount: number
  currency: string

  source: WalletTransactionSource

  description?: string

  bookingRef?: Types.ObjectId
  bookingHoldRef?: Types.ObjectId
  paymentRef?: Types.ObjectId

  stripePaymentIntentId?: string

  createdAt: Date
  updatedAt: Date
}
