import { Document, model,models, Types } from 'mongoose'
import { BookingSchema } from '../schemas/booking_schema'
import { BookingMongoBase } from '../types/booking_mongo_base'

export interface IBookingModel extends BookingMongoBase, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const BookingModel = models.Booking || model<IBookingModel>('Booking', BookingSchema)
