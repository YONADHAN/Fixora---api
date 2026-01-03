"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ChatSchema = new mongoose_1.Schema({
    chatId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    customerId: {
        type: String,
        required: true,
        index: true,
    },
    vendorId: {
        type: String,
        required: true,
        index: true,
    },
    serviceId: {
        type: String,
        required: true,
        index: true,
    },
    lastMessage: {
        messageId: { type: String },
        content: { type: String },
        senderId: { type: String },
        senderRole: {
            type: String,
            enum: ['customer', 'vendor'],
        },
        createdAt: { type: Date },
    },
    unreadCount: {
        customer: { type: Number, default: 0 },
        vendor: { type: Number, default: 0 },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.ChatSchema.index({ customerId: 1, vendorId: 1, serviceId: 1 }, { unique: true });
