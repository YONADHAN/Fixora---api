"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceCategorySchema = void 0;
const mongoose_1 = require("mongoose");
exports.serviceCategorySchema = new mongoose_1.Schema({
    serviceCategoryId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    bannerImage: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
