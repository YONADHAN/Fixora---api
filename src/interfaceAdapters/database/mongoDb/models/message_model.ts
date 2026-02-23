import { Document, model, models, Types } from 'mongoose'
import { MessageSchema } from '../schemas/message_schema'
import { MessageMongoBase } from '../types/message_mongo_base'

export interface IMessageModel extends MessageMongoBase, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const MessageModel = models.Message || model<IMessageModel>('Message', MessageSchema)
