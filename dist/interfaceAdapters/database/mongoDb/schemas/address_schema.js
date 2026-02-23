"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AddressSchema = new mongoose_1.Schema({
    addressId: {
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
    label: {
        type: String,
        default: 'Home',
    },
    addressType: {
        type: String,
        enum: ['home', 'office', 'other'],
        default: 'home',
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    contactName: { type: String },
    contactPhone: { type: String },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: 'India' },
    zipCode: { type: String },
    instructions: { type: String },
    geoLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true,
        },
    },
    location: {
        name: { type: String },
        displayName: { type: String },
    },
}, { timestamps: true });
exports.AddressSchema.index({ geoLocation: '2dsphere' });
exports.AddressSchema.index({ customerId: 1 });
