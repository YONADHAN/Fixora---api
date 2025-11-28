import { Schema } from 'mongoose'

export const SlotSchema = new Schema<ISlot>(
  {
    slotId: { type: String, required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },

    slotDate: { type: Date, required: true },

    startTime: { type: String, required: true }, // "HH:mm"
    endTime: { type: String, required: true }, // "HH:mm"

    status: {
      type: String,
      enum: ['AVAILABLE', 'BOOKED', 'CANCELLED'],
      default: 'AVAILABLE',
    },

    bookedBy: { type: Schema.Types.ObjectId, ref: 'Customer' },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
  },
  { timestamps: true }
)

// To prevent double-booking race conditions
SlotSchema.index({ serviceId: 1, slotDate: 1, startTime: 1 }, { unique: true })
