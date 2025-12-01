import { Document, ObjectId, model } from 'mongoose'
import { IServiceHistoryEntity } from '../../../../domain/models/service_history_entity'
import { ServiceHistorySchema } from '../schemas/service_history_schema'

export interface IServiceHistoryModel
  extends Omit<IServiceHistoryEntity, '_id' | 'serviceRef'>,
    Document {
  _id: ObjectId
  serviceRef: ObjectId
}

export const ServiceHistoryModel = model<IServiceHistoryModel>(
  'ServiceHistory',
  ServiceHistorySchema
)
