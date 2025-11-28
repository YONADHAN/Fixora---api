import { Schema } from 'mongoose'

export const ServiceSchema = new Schema<IService>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    subServiceCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SubServiceCategory',
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String },
    pricing: {
      pricePerSlot: { type: Number, required: true },
      isAdvanceRequired: { type: Boolean, default: false },
      advanceAmount: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },

    images: [String],

    // Activation flags
    isActiveByAdmin: { type: Boolean, default: true },
    isActiveByVendor: { type: Boolean, default: true },
    adminStatusNote: { type: String },

    // Schedule
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

    history: [
      {
        historyId: { type: String },
        title: String,
        description: String,
        images: [String],
        completedOn: Date,
      },
    ],
  },
  { timestamps: true }
)
