import { Schema } from 'mongoose'
import { IServiceHistoryModel } from '../models/service_history_model'

export const ServiceHistorySchema = new Schema<IServiceHistoryModel>(
  {
    serviceRef: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },

    historyId: { type: String },
    title: { type: String },
    description: { type: String },
    images: [String],
    completedOn: { type: Date },
  },
  { timestamps: true }
)
