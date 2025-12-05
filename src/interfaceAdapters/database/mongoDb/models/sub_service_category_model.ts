import { Document, model, ObjectId, Schema } from 'mongoose'
import {
  IServiceCategoryPopulated,
  ISubServiceCategoryEntity,
} from '../../../../domain/models/sub_service_category_entity'
import { subServiceCategorySchema } from '../schemas/sub_service_category_schema'

export interface ISubServiceCategoryModel
  extends Omit<ISubServiceCategoryEntity, '_id' | 'serviceCategoryRef'>,
    Document {
  _id: Schema.Types.ObjectId
  serviceCategoryRef: Schema.Types.ObjectId | IServiceCategoryPopulated
}

export const SubServiceCategoryModel = model<ISubServiceCategoryModel>(
  'SubServiceCategory',
  subServiceCategorySchema
)
