import { Document, model, models, Types } from 'mongoose'
import {
  IServiceCategoryPopulated,
  ISubServiceCategoryEntity,
} from '../../../../domain/models/sub_service_category_entity'
import { subServiceCategorySchema } from '../schemas/sub_service_category_schema'

export interface ISubServiceCategoryModel
  extends Omit<ISubServiceCategoryEntity, '_id' | 'serviceCategoryRef'>,
    Document {
  _id: Types.ObjectId
  serviceCategoryRef: Types.ObjectId | IServiceCategoryPopulated
}

export const SubServiceCategoryModel = models.SubServiceCategory || model<ISubServiceCategoryModel>(
  'SubServiceCategory',
  subServiceCategorySchema
)
