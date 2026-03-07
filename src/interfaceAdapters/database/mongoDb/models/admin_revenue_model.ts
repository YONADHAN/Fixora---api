import { Document, model, models, Types } from 'mongoose'
import { AdminRevenueSchema } from '../schemas/admin_revenue_schema'
import { AdminRevenueMongoBase } from '../types/admin_revenue_mongo_base'

export interface IAdminRevenueModel
  extends AdminRevenueMongoBase,
    Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const AdminRevenueModel =
  models.AdminRevenue ||
  model<IAdminRevenueModel>('AdminRevenue', AdminRevenueSchema)