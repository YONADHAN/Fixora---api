import { Types } from 'mongoose'
import { IReviewEntity } from '../../../../domain/models/review_entity'

// Omit the _id from the entity since Mongoose handles it, but keep other properties matching
export interface ReviewMongoBase extends Omit<IReviewEntity, '_id'> {
    _id: Types.ObjectId
    createdAt: Date
    updatedAt: Date
}
