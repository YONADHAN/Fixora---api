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

    name: { type: String, required: true },

    serviceVariants: {
      type: [
        {
          name: { type: String, required: true },
          description: { type: String },
          price: { type: Number },
        },
      ],
      default: [],
    },

    description: { type: String },

    pricing: {
      pricePerSlot: { type: Number, required: true },
      advanceAmountPerSlot: { type: Number, default: 0 },
    },
    mainImage: { type: String, required: true },

    /** STATUS */
    isActiveStatusByAdmin: { type: Boolean, default: true },
    isActiveStatusByVendor: { type: Boolean, default: true },
    adminStatusNote: { type: String },

    /** MAIN SCHEDULING BLOCK */
    schedule: {
      visibilityStartDate: Date,
      visibilityEndDate: Date,

      /** BASE WORKING WINDOWS (Supports breaks, split shifts) */
      dailyWorkingWindows: [
        {
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
        },
      ],

      /** Default slot duration */
      slotDurationMinutes: Number,

      recurrenceType: String,
      weeklyWorkingDays: [Number],
      monthlyWorkingDates: [Number],

      /** BLOCK OVERRIDES */
      overrideBlock: [
        {
          startDateTime: { type: Date, required: true },
          endDateTime: { type: Date, required: true },
          reason: { type: String },
        },
      ],

      /** CUSTOM SCHEDULE OVERRIDES */
      overrideCustom: [
        {
          startDateTime: { type: Date, required: true },
          endDateTime: { type: Date, required: true },

          startTime: { type: String },
          endTime: { type: String },
        },
      ],
    },
  },
  { timestamps: true }
)
