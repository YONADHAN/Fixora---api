"use strict";
// import { Document, model, ObjectId } from 'mongoose'
// import { ISlotEntity } from '../../../../domain/models/slot_entity'
// import { slotSchema } from '../schemas/slot_schema'
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotModel = void 0;
// export interface ISlotModel extends ISlotEntity, Document {
//   _id: ObjectId
// }
// export const SlotModel = model<ISlotModel>('Slot', slotSchema)
const mongoose_1 = require("mongoose");
const slot_schema_1 = require("../schemas/slot_schema");
exports.SlotModel = (0, mongoose_1.model)('Slot', slot_schema_1.SlotSchema);
