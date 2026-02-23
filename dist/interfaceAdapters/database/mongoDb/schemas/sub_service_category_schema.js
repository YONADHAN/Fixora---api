"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subServiceCategorySchema = void 0;
const mongoose_1 = require("mongoose");
exports.subServiceCategorySchema = new mongoose_1.Schema({
    subServiceCategoryId: { type: String, required: true, unique: true },
    serviceCategoryRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
        required: true,
    },
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    bannerImage: { type: String, trim: true },
    isActive: { type: String, default: 'active', enum: ['active', 'blocked'] },
    verification: {
        type: String,
        default: 'pending',
        enum: ['pending', 'accepted', 'rejected'],
    },
    createdById: { type: String, required: true },
    createdByRole: { type: String, required: true },
}, {
    timestamps: true,
});
