import { Types } from 'mongoose'

export type RevenueSourceType =
  | 'service_commission'
  | 'subscription'

export interface AdminRevenueMongoBase {
  _id: Types.ObjectId

  revenueId: string

  source: RevenueSourceType

  referenceId?: string

  amount: number

  currency: string

  createdAt: Date
  updatedAt: Date
}