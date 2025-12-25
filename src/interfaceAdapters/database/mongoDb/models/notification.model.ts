import { Document, model, Types } from 'mongoose'
import { NotificationSchema } from '../schemas/notification_schema'
import { NotificationMongoBase } from '../types/notification_mongo_base'

export interface INotificationModel extends NotificationMongoBase, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const NotificationModel = model<INotificationModel>(
  'Notification',
  NotificationSchema
)
