import { Schema } from 'mongoose'
import { IServiceModel } from '../models/service_model'

export const ServiceSchema = new Schema<IServiceModel>(
  {
    serviceId: {
      type: String,
      required: true,
    },
    vendorRef: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },

    subServiceCategoryRef: {
      type: Schema.Types.ObjectId,
      ref: 'SubServiceCategory',
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String },

    pricing: {
      pricePerSlot: { type: Number, required: true },
      isAdvanceRequired: { type: Boolean, default: false },
      advanceAmountPerSlot: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },

    images: [String],

    isActiveStatusByAdmin: { type: Boolean, default: true },
    isActiveStatusByVendor: { type: Boolean, default: true },
    adminStatusNote: { type: String },

    schedule: {
      visibilityStartDate: Date,
      visibilityEndDate: Date,

      workStartTime: String,
      workEndTime: String,
      slotDurationMinutes: Number,

      recurrenceType: String,
      weeklyWorkingDays: [Number],
      monthlyWorkingDates: [Number],
      holidayDates: [Date],
    },

    serviceHistoryRefs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ServiceHistory',
      },
    ],
  },
  { timestamps: true }
)
