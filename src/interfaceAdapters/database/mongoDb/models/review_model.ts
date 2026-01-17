import { Document, model, Types } from 'mongoose'
import { ReviewSchema } from '../schemas/review_schema'
import { ReviewMongoBase } from '../types/review_mongo_base'

export interface IReviewModel extends ReviewMongoBase, Document {
    _id: Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

export const ReviewModel = model<IReviewModel>('Review', ReviewSchema)
