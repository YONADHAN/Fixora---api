import { Document, model, ObjectId } from 'mongoose'
import { ISlotEntity } from '../../../../domain/models/slot_entity'
import { slotSchema } from '../schemas/slot_schema'

export interface ISlotModel extends ISlotEntity, Document {
  _id: ObjectId
}

export const SlotModel = model<ISlotModel>('Slot', slotSchema)
