import { Schema } from 'mongoose'

export const WalletSchema = new Schema(
  {
    walletId: {
      type: String,
      required: true,
      unique: true,
    },

    userRef: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    userType: {
      type: String,
      enum: ['customer', 'vendor', 'admin'],
      required: true,
    },

    currency: {
      type: String,
      default: 'INR',
    },

    balance: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)
