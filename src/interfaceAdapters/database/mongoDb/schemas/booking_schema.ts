import { Schema } from 'mongoose'
import { IBookingModel } from '../models/booking_model'
export const BookingSchema = new Schema<IBookingModel>(
  {
    bookingId: { type: String, required: true },
    bookingGroupId: { type: String, required: true },

    serviceRef: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    vendorRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customerRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    date: { type: String, required: true },
    slotStart: Date,
    slotEnd: Date,

    paymentRef: { type: Schema.Types.ObjectId, ref: 'Payment' },

    paymentStatus: {
      type: String,
      enum: [
        'pending',
        'advance-paid',
        'paid',
        'pending-refund',
        'refunded',
        'failed',
      ],
      default: 'pending',
    },
    stripePaymentIntentId: { type: String },
    stripeSlotPaymentRefundId: { type: String },
    serviceStatus: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },

    cancelInfo: {
      cancelledByRole: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
      },
      cancelledByRef: { type: Schema.Types.ObjectId, ref: 'User' },
      reason: String,
      cancelledAt: Date,
    },
  },
  { timestamps: true }
)
