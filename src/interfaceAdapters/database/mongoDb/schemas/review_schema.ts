import { Schema, model, Document } from 'mongoose'
import { IReviewEntity } from '../../../../domain/models/review_entity'


export const ReviewSchema = new Schema(
    {
        reviewId: {
            type: String,
            required: true,
            unique: true,
        },
        bookingId: {
            type: String,
            required: true,
            unique: true,
        },
        serviceId: {
            type: String,
            required: true,
            index: true,
        },
        customerId: {
            type: String,
            required: true,
        },
        vendorId: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)
