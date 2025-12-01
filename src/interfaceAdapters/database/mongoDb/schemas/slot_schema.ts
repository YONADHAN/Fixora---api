import { Schema } from 'mongoose'
import { ISlotModel } from '../models/slot_model'

export const SlotSchema = new Schema<ISlotModel>(
  {
    slotId: { type: String, required: true },
    serviceRef: { type: Schema.Types.ObjectId, ref: 'Service', required: true },

    slotDate: { type: Date, required: true },

    startTime: { type: String, required: true }, // "HH:mm"
    endTime: { type: String, required: true }, // "HH:mm"

    bookingStatus: {
      type: String,
      enum: ['available', 'booked', 'cancelled'],
      default: 'available',
    },

    bookedBy: { type: Schema.Types.ObjectId, ref: 'Customer' },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
  },
  { timestamps: true }
)

SlotSchema.index({ serviceRef: 1, slotDate: 1, startTime: 1 }, { unique: true })
