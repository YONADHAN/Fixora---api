import { Schema } from 'mongoose'
import { IServiceCategoryModel } from '../models/service_category_model'

export const serviceCategorySchema = new Schema<IServiceCategoryModel>(
  {
    serviceCategoryId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    bannerImage: { type: String, trim: true },
    icon: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)
