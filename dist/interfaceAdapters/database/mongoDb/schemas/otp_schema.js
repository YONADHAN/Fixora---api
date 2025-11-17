"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpSchema = void 0;
const mongoose_1 = require("mongoose");
exports.otpSchema = new mongoose_1.Schema({
    otp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 60,
    },
}, {
    timestamps: true,
});
