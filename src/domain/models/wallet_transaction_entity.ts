import {
  statusTypes,
  TRole,
  WalletTransactionSource,
  WalletTransactionType,
} from '../../shared/constants'

export interface IWalletTransactionEntity {
  _id?: string

  transactionId: string

  walletRef: string
  userRef: string

  type: WalletTransactionType
  source: WalletTransactionSource

  amount: number
  currency: string

  description?: string

  bookingRef?: string
  bookingHoldRef?: string
  paymentRef?: string

  stripePaymentIntentId?: string

  populatedValues?: {
    wallet?: {
      walletId: string
      userType: TRole
      currency: string
    }

    user?: {
      userId: string
      name: string
      role: TRole
      profileImage?: string
      status?: statusTypes
    }

    booking?: {
      bookingId: string
      serviceName?: string
      date?: string
      slot?: {
        start: string
        end: string
      }
    }
  }

  createdAt?: Date
  updatedAt?: Date
}
