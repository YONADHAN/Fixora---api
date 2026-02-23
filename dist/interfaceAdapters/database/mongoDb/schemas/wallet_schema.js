"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSchema = void 0;
const mongoose_1 = require("mongoose");
exports.WalletSchema = new mongoose_1.Schema({
    walletId: {
        type: String,
        required: true,
        unique: true,
    },
    userRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    userType: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        required: true,
    },
    currency: {
        type: String,
        default: 'INR',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
