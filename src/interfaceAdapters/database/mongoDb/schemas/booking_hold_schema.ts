import { Schema } from 'mongoose'
import { IBookingHoldModel } from '../models/booking_hold_model'

export const BookingHoldSchema = new Schema<IBookingHoldModel>(
  {
    holdId: { type: String, required: true, unique: true },

    serviceRef: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },

    vendorRef: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    customerRef: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    addressId: { type: String, required: true },

    slots: [
      {
        date: { type: String, required: true },
        start: { type: String, required: true },
        end: { type: String, required: true },

        pricePerSlot: { type: Number, required: true },
        advancePerSlot: { type: Number, required: true },

        variant: {
          name: { type: String },
          price: { type: Number },
        },
      },
    ],

    pricing: {
      totalAmount: { type: Number, required: true },
      advanceAmount: { type: Number, required: true },
      remainingAmount: { type: Number, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ['stripe'],
      required: true,
    },

    stripePaymentIntentId: { type: String },

    status: {
      type: String,
      enum: ['active', 'completed', 'expired', 'failed'],
      default: 'active',
    },

    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
)
