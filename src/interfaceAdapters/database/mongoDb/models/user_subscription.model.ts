import { Document, model, Types } from 'mongoose'
import { UserSubscriptionSchema } from '../schemas/user_subscription_schema'
import { UserSubscriptionMongoBase } from '../types/user_subscription_mongo_base'

export interface IUserSubscriptionModel
  extends UserSubscriptionMongoBase, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const UserSubscriptionModel = model<IUserSubscriptionModel>(
  'UserSubscription',
  UserSubscriptionSchema,
)
