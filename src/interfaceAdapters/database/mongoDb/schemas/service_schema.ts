import { Schema } from 'mongoose'
import { IServiceModel } from '../models/service_model'

export const serviceSchema = new Schema<IServiceModel>(
  {
    serviceId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrls: [{ type: String, trim: true }],
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: true,
    },
    vendorId: { type: Schema.Types.ObjectId, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)
