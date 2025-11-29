import { Schema, model } from 'mongoose'
import { IServiceHistory } from '../models/service_history_model'

export const ServiceHistorySchema = new Schema<IServiceHistory>(
  {
    serviceId: {
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

export const ServiceHistoryModel = model<IServiceHistory>(
  'ServiceHistory',
  ServiceHistorySchema
)
