import { TRole } from '../../shared/constants'

export type RevenueSourceType =
  | 'service_commission'
  | 'subscription'

export interface IAdminRevenueEntity {
  _id?: string

  revenueId: string

  source: RevenueSourceType

  referenceId?: string

  amount: number

  currency: string

  createdAt?: Date
  updatedAt?: Date
}