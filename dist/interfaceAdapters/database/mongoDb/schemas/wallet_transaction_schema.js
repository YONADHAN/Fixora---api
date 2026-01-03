"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletTransactionSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../../shared/constants");
exports.WalletTransactionSchema = new mongoose_1.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    walletRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true,
        index: true,
    },
    userRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: constants_1.WALLET_TRANSACTION_TYPES,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'INR',
    },
    source: {
        type: String,
        enum: constants_1.WALLET_TRANSACTION_SOURCES,
        required: true,
    },
    description: {
        type: String,
    },
    bookingRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Booking',
    },
    bookingHoldRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'BookingHold',
    },
    paymentRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    stripePaymentIntentId: {
        type: String,
    },
}, { timestamps: true });
