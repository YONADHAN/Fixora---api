import { Document, model, ObjectId } from 'mongoose'
import { IServiceCategoryEntity } from '../../../../domain/models/service_category_entity'
import { serviceCategorySchema } from '../schemas/service_category_schema'

export interface IServiceCategoryModel
  extends IServiceCategoryEntity,
    Document {
  _id: ObjectId
}

export const ServiceCategoryModel = model<IServiceCategoryModel>(
  'ServiceCategory',
  serviceCategorySchema
)
