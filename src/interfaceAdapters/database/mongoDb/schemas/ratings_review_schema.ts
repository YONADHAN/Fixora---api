import { Schema } from 'mongoose'
import { IRatingsReviewModel } from '../models/ratings_review_model'

export const RatingsReviewSchema = new Schema<IRatingsReviewModel>(
  {
    ratingsReviewId: { type: String, required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    serviceRef: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    customerRef: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

RatingsReviewSchema.index(
  { serviceRef: 1, customerRef: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
  },
)
