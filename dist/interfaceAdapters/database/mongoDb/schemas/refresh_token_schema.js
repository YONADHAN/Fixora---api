"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = void 0;
const mongoose_1 = require("mongoose");
exports.refreshTokenSchema = new mongoose_1.Schema({
    user: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ['admin', 'vendor', 'customer'],
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 604800,
    },
});
