import { Types } from 'mongoose'

export interface RatingsReviewMongoBase {
  _id: Types.ObjectId
  ratingsReviewId: string
  rating: number
  review: string
  serviceRef: Types.ObjectId
  customerRef: Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
