import { Schema } from 'mongoose'
import { ISubscriptionPlanModel } from '../models/subscription_plan.model'

export const SubscriptionPlanSchema = new Schema<ISubscriptionPlanModel>(
  {
    planId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stripeProductId: {
      type: String,
      required: true,
      index: true,
    },

    stripePriceId: {
      type: String,
      required: true,
      index: true,
    },

    currency: {
      type: String,
      default: 'INR',
    },

    durationInDays: {
      type: Number,
      required: true,
    },

    features: {
      maxServices: { type: Number },
      videoCallAccess: { type: Boolean, default: false },
      aiChatbotAccess: { type: Boolean, default: false },
    },

    benefits: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdByAdminId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

SubscriptionPlanSchema.index({ isActive: 1, price: 1 })
