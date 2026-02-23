import { Document, model, models, ObjectId } from 'mongoose'
import { IServiceCategoryEntity } from '../../../../domain/models/service_category_entity'
import { serviceCategorySchema } from '../schemas/service_category_schema'

export interface IServiceCategoryModel
  extends Omit<IServiceCategoryEntity, '_id'>,
    Document {
  _id: ObjectId
}

export const ServiceCategoryModel = models.ServiceCategory || model<IServiceCategoryModel>(
  'ServiceCategory',
  serviceCategorySchema
)
