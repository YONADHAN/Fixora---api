import { Document, model, models, Types } from 'mongoose'
import { SubscriptionPlanSchema } from '../schemas/subscription_plan_schema'
import { SubscriptionPlanMongoBase } from '../types/subscription_plan_mongo_base'

export interface ISubscriptionPlanModel
  extends SubscriptionPlanMongoBase, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const SubscriptionPlanModel = models.SubscriptionPlan || model<ISubscriptionPlanModel>(
  'SubscriptionPlan',
  SubscriptionPlanSchema,
)
