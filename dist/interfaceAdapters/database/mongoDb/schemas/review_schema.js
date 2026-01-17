"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
    reviewId: {
        type: String,
        required: true,
        unique: true,
    },
    bookingId: {
        type: String, // Storing UUID string to match booking entity
        required: true,
        unique: true, // One review per booking
    },
    serviceId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: 'Service',
        index: true,
    },
    customerId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: 'Customer',
    },
    vendorId: {
        type: mongoose_1.Types.ObjectId, // Vendor who provided the service
        required: true,
        ref: 'Vendor',
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
}, {
    timestamps: true,
});
exports.ReviewModel = (0, mongoose_1.model)('Review', ReviewSchema);
