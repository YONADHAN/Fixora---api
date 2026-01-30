import { model, Types } from 'mongoose'
import { RatingsReviewMongoBase } from '../types/ratings_review_mongo_base'
import { RatingsReviewSchema } from '../schemas/ratings_review_schema'

export interface IRatingsReviewModel extends RatingsReviewMongoBase, Document {
  _id: Types.ObjectId
  serviceRef: Types.ObjectId
  customerRef: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const RatingsReviewModel = model<IRatingsReviewModel>(
  'RatingsReview',
  RatingsReviewSchema,
)
