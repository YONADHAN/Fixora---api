// import { Document, model, ObjectId } from 'mongoose'
// import { ISlotEntity } from '../../../../domain/models/slot_entity'
// import { slotSchema } from '../schemas/slot_schema'

// export interface ISlotModel extends ISlotEntity, Document {
//   _id: ObjectId
// }

// export const SlotModel = model<ISlotModel>('Slot', slotSchema)

import { Document, model, ObjectId } from 'mongoose'
import { ISlotEntity } from '../../../../domain/models/slot_entity'
import { SlotSchema } from '../schemas/slot_schema'

export interface ISlotModel
  extends Omit<ISlotEntity, '_id' | 'serviceRef' | 'bookedBy' | 'bookingId'>,
    Document {
  _id: ObjectId
  serviceRef: ObjectId
  bookedBy: ObjectId
  bookingId: ObjectId
}

export const SlotModel = model<ISlotModel>('Slot', SlotSchema)
