"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BookingSchema = new mongoose_1.Schema({
    bookingId: { type: String, required: true },
    bookingGroupId: { type: String, required: true },
    serviceRef: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service', required: true },
    vendorRef: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    customerRef: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    slotStart: Date,
    slotEnd: Date,
    paymentRef: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Payment' },
    paymentStatus: {
        type: String,
        enum: [
            'pending',
            'advance-paid',
            'paid',
            'pending-refund',
            'refunded',
            'failed',
        ],
        default: 'pending',
    },
    stripePaymentIntentId: { type: String },
    stripeSlotPaymentRefundId: { type: String },
    serviceStatus: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled',
    },
    cancelInfo: {
        cancelledByRole: {
            type: String,
            enum: ['customer', 'vendor', 'admin'],
        },
        cancelledByRef: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        cancelledAt: Date,
    },
}, { timestamps: true });
