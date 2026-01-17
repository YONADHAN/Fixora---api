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
    customerRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'Customer'
    },
    vendorRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'Vendor'
    },
    serviceRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'Service'
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
exports.ChatSchema.index({ customerRef: 1, vendorRef: 1, serviceRef: 1 }, { unique: true });
