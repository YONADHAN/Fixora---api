import { Schema } from 'mongoose'
import { ISubServiceCategoryModel } from '../models/sub_service_category_model'

export const subServiceCategorySchema = new Schema<ISubServiceCategoryModel>(
  {
    subServiceCategoryId: { type: String, required: true, unique: true },
    serviceCategoryId: { type: String, required: true },
    serviceCategoryName: { type: String, required: true },
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    bannerImage: { type: String, trim: true },
    isActive: { type: String, default: 'active', enum: ['active', 'blocked'] },
    verification: {
      type: String,
      default: 'pending',
      enum: ['pending', 'accepted', 'rejected'],
    },
    createdById: { type: String, required: true },
    createdByRole: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)
