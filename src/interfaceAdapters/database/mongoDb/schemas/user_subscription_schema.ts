import { Schema } from 'mongoose'
import { IUserSubscriptionModel } from '../models/user_subscription.model'

export const UserSubscriptionSchema = new Schema<IUserSubscriptionModel>(
  {
    subscriptionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    userRole: {
      type: String,
      enum: ['vendor', 'customer'],
      required: true,
      index: true,
    },

    subscriptionPlanId: {
      type: String,
      required: true,
      index: true,
    },

    stripeCheckoutSessionId: {
      type: String,
      index: true,
    },

    stripeSubscriptionId: {
      type: String,
      index: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ['pending', 'active', 'expired', 'cancelled'],
      default: 'pending',
      index: true,
    },

    autoRenew: {
      type: Boolean,
      default: false,
    },

    paymentProvider: {
      type: String,
      enum: ['stripe', 'razorpay'],
      required: true,
    },

    paymentId: {
      type: String,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ['initiated', 'success', 'failed'],
      default: 'initiated',
    },
  },
  { timestamps: true },
)

UserSubscriptionSchema.index({ userId: 1, status: 1 })
UserSubscriptionSchema.index({ endDate: 1 })
