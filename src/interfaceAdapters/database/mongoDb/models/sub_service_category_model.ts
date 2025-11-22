import { Document, model, ObjectId } from 'mongoose'
import { ISubServiceCategoryEntity } from '../../../../domain/models/sub_service_category_entity'
import { subServiceCategorySchema } from '../schemas/sub_service_category_schema'

export interface ISubServiceCategoryModel
  extends ISubServiceCategoryEntity,
    Document {
  _id: ObjectId
}

export const SubServiceCategoryModel = model<ISubServiceCategoryModel>(
  'SubServiceCategory',
  subServiceCategorySchema
)
