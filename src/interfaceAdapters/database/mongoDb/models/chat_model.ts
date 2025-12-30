import { Document, model, Types } from 'mongoose'
import { ChatSchema } from '../schemas/chat_schema'
import { ChatMongoBase } from '../types/chat_mongo_base'

export interface IChatModel extends ChatMongoBase, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const ChatModel = model<IChatModel>('Chat', ChatSchema)
