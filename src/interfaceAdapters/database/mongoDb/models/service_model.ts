import { Document, model, ObjectId } from 'mongoose'
import { IServiceEntity } from '../../../../domain/models/service_entity'
import { ServiceSchema } from '../schemas/service_schema'

export interface IServiceModel
  extends Omit<
      IServiceEntity,
      '_id' | 'vendorRef' | 'subServiceCategoryRef' | 'serviceHistoryRefs'
    >,
    Document {
  _id: ObjectId
  vendorRef: ObjectId
  subServiceCategoryRef: ObjectId
  serviceHistoryRefs: ObjectId[]
}

export const ServiceModel = model<IServiceModel>('Service', ServiceSchema)
