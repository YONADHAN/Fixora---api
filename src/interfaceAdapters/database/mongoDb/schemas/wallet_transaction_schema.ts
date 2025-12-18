import { Schema } from 'mongoose'

export const WalletTransactionSchema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    walletRef: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
      index: true,
    },

    userRef: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: 'INR',
    },

    source: {
      type: String,
      enum: [
        'wallet-topup',
        'booking-refund',
        'admin-adjustment',
        'service-payout',
        'opening-balance',
      ],
      required: true,
    },

    description: {
      type: String,
    },

  
    bookingRef: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },

    bookingHoldRef: {
      type: Schema.Types.ObjectId,
      ref: 'BookingHold',
    },

    paymentRef: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },

    stripePaymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
)
