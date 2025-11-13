import { Document, model, ObjectId } from 'mongoose'
import { IServiceEntity } from '../../../../domain/models/service_entity'
import { serviceSchema } from '../schemas/service_schema'

export interface IServiceModel extends IServiceEntity, Document {
  _id: ObjectId
}

export const ServiceModel = model<IServiceModel>('Service', serviceSchema)
