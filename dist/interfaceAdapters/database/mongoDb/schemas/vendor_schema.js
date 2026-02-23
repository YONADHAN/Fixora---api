"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorSchema = void 0;
// vendorSchema.index({ geoLocation: '2dsphere' })
const mongoose_1 = require("mongoose");
exports.vendorSchema = new mongoose_1.Schema({
    userId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String },
    role: { type: String, default: 'vendor' },
    googleId: { type: String },
    status: { type: String, default: 'pending' },
    profileImage: { type: String },
    geoLocation: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: [Number],
    },
    location: {
        name: String,
        displayName: String,
        zipCode: String,
    },
    documents: [
        {
            name: { type: String, required: true },
            url: { type: String, required: true },
            verified: { type: Boolean, default: false },
            uploadedAt: { type: Date, default: Date.now },
        },
    ],
    isVerified: {
        status: {
            type: String,
            enum: ['accepted', 'rejected', 'pending'],
            default: 'pending',
        },
        description: {
            type: String,
            default: '',
        },
        reviewedBy: {
            adminId: { type: String, default: null },
            reviewedAt: { type: Date },
        },
    },
}, { timestamps: true });
exports.vendorSchema.index({ geoLocation: '2dsphere' });
