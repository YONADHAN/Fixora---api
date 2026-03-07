import { Schema } from 'mongoose'

export const AdminRevenueSchema = new Schema(
  {
    revenueId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    source: {
      type: String,
      enum: ['service_commission', 'subscription'],
      required: true,
      index: true,
    },

    referenceId: {
      type: String,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: 'INR',
    },
  },
  { timestamps: true },
)

AdminRevenueSchema.index({ source: 1, createdAt: -1 })