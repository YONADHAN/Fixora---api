import { Document, model, models, Types } from 'mongoose'
import { PaymentSchema } from '../schemas/payment_schema'
import { PaymentMongoBase } from '../types/payment_mongo_base'

export interface IPaymentModel extends PaymentMongoBase, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const PaymentModel =  models.Payment || model<IPaymentModel>('Payment', PaymentSchema)
