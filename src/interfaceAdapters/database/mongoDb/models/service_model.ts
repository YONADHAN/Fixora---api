import { Document, model, models, Types } from 'mongoose'
import { IServiceEntity } from '../../../../domain/models/service_entity'
import { ServiceSchema } from '../schemas/service_schema'

export interface IServiceModel
  extends Omit<IServiceEntity, '_id' | 'vendorRef' | 'subServiceCategoryRef'>,
    Document {
  _id: Types.ObjectId
  vendorRef: Types.ObjectId
  subServiceCategoryRef: Types.ObjectId
}

export const ServiceModel = models.Service || model<IServiceModel>('Service', ServiceSchema)
