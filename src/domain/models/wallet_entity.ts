import { TRole, statusTypes } from '../../shared/constants'

export interface IWalletEntity {
  _id?: string

  walletId: string

  userRef: string
  userType: TRole

  currency: string
  isActive: boolean

  balance?: number

  populatedValues?: {
    user?: {
      userId: string
      name: string
      email?: string
      profileImage?: string
      role?: TRole
      status?: statusTypes
    }
  }

  createdAt?: Date
  updatedAt?: Date
}
