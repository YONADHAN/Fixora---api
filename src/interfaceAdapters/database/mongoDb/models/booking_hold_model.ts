import { Document, model, Types } from 'mongoose'
import { BookingHoldSchema } from '../schemas/booking_hold_schema'
import { BookingHoldMongoBase } from '../types/booking_hold_base'

export interface IBookingHoldModel extends BookingHoldMongoBase, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const BookingHoldModel = model<IBookingHoldModel>(
  'BookingHold',
  BookingHoldSchema
)
