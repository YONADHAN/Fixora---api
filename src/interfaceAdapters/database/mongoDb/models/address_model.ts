import { Document, model, models, Types } from 'mongoose'
import { AddressSchema } from '../schemas/address_schema'
import { AddressMongoBase } from '../types/address_mongo_base'

export interface IAddressModel extends AddressMongoBase, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const AddressModel = models.Address || model<IAddressModel>('Address', AddressSchema)
