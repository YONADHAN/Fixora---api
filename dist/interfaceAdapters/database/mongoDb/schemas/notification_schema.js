"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.NotificationSchema = new mongoose_1.Schema({
    notificationId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    recipientId: {
        type: String,
        required: true,
        index: true,
    },
    recipientRole: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: [
            'BOOKING_CREATED',
            'BOOKING_CANCELLED',
            'BOOKING_CONFIRMED',
            'PAYMENT_SUCCESS',
            'PAYMENT_FAILED',
            'ADMIN_MESSAGE',
        ],
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    metadata: {
        bookingId: { type: String },
        serviceId: { type: String },
        paymentId: { type: String },
        redirectUrl: { type: String },
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true,
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
}, { timestamps: true });
exports.NotificationSchema.index({ recipientId: 1, isRead: 1 });
exports.NotificationSchema.index({ recipientId: 1, createdAt: -1 });
