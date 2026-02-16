import { Document, model, models, ObjectId } from 'mongoose'
import { ICustomerEntity } from '../../../../domain/models/customer_entity'
import { customerSchema } from '../schemas/customer_schema'

export interface ICustomerModel extends ICustomerEntity, Document {
  _id: ObjectId
}

export const CustomerModel = models.Customer || model<ICustomerModel>('Customer', customerSchema)
