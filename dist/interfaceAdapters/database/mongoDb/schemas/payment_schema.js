"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PaymentSchema = new mongoose_1.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true,
    },
    bookingGroupId: {
        type: String,
        required: true,
        index: true,
    },
    customerRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    vendorRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    serviceRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    advancePayment: {
        stripePaymentIntentId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            enum: ['INR'],
            default: 'INR',
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            required: true,
        },
        paidAt: Date,
        failures: [
            {
                code: String,
                message: String,
                type: {
                    type: String,
                    enum: ['card_error', 'api_error'],
                },
                stripeEventId: String,
                occurredAt: Date,
            },
        ],
    },
    slots: [
        {
            bookingId: {
                type: String,
                required: true,
            },
            pricing: {
                totalPrice: { type: Number, required: true },
                advanceAmount: { type: Number, required: true },
                remainingAmount: { type: Number, required: true },
            },
            advanceRefund: {
                refundId: String,
                amount: Number,
                status: {
                    type: String,
                    enum: ['pending', 'succeeded', 'failed'],
                },
                initiatedBy: {
                    type: String,
                    enum: ['customer', 'vendor', 'admin'],
                },
                initiatedByUserId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    required: false,
                },
                createdAt: Date,
                failures: [
                    {
                        code: String,
                        message: String,
                        stripeEventId: String,
                        occurredAt: Date,
                    },
                ],
            },
            remainingPayment: {
                stripePaymentIntentId: String,
                amount: Number,
                status: {
                    type: String,
                    enum: ['pending', 'paid', 'failed'],
                },
                paidAt: Date,
                failures: [
                    {
                        code: String,
                        message: String,
                        type: {
                            type: String,
                            enum: ['card_error', 'api_error'],
                        },
                        stripeEventId: String,
                        occurredAt: Date,
                    },
                ],
            },
            status: {
                type: String,
                enum: [
                    'advance-paid',
                    'advance-refunded',
                    'remaining-pending',
                    'fully-paid',
                    'cancelled',
                ],
                required: true,
            },
        },
    ],
    status: {
        type: String,
        enum: [
            'advance-paid',
            'partially-refunded',
            'refunded',
            'partially-paid',
            'fully-paid',
        ],
        required: true,
    },
}, { timestamps: true });
exports.PaymentSchema.index({ paymentId: 1 });
exports.PaymentSchema.index({ bookingGroupId: 1 });
exports.PaymentSchema.index({ 'advancePayment.stripePaymentIntentId': 1 });
exports.PaymentSchema.index({ 'slots.advanceRefund.refundId': 1 });
exports.PaymentSchema.index({ 'slots.remainingPayment.stripePaymentIntentId': 1 });
