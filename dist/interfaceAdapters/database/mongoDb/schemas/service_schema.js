"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceSchema = void 0;
const mongoose_1 = require("mongoose");
exports.serviceSchema = new mongoose_1.Schema({
    serviceId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrls: [{ type: String, trim: true }],
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
        required: true,
    },
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
