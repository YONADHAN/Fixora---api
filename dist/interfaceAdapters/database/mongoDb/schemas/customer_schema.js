"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerSchema = void 0;
const mongoose_1 = require("mongoose");
exports.customerSchema = new mongoose_1.Schema({
    userId: { type: String, unique: true },
    name: { type: String, unique: false },
    email: { type: String, required: true },
    role: { type: String, default: 'customer' },
    password: { type: String },
    phone: { type: String },
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active',
    },
    googleId: { type: String },
    geoLocation: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        },
    },
    location: {
        name: { type: String },
        displayName: { type: String },
        zipCode: { type: String },
    },
}, { timestamps: true });
exports.customerSchema.index({ geoLocation: '2dsphere' });
