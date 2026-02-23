"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotSchema = void 0;
const mongoose_1 = require("mongoose");
exports.SlotSchema = new mongoose_1.Schema({
    slotId: { type: String, required: true },
    serviceRef: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service', required: true },
    slotDate: { type: Date, required: true },
    startTime: { type: String, required: true }, // "HH:mm"
    endTime: { type: String, required: true }, // "HH:mm"
    bookingStatus: {
        type: String,
        enum: ['available', 'booked', 'cancelled'],
        default: 'available',
    },
    bookedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Customer' },
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Booking' },
}, { timestamps: true });
exports.SlotSchema.index({ serviceRef: 1, slotDate: 1, startTime: 1 }, { unique: true });
