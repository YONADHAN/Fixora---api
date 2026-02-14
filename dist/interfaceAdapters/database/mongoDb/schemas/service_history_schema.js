"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceHistorySchema = void 0;
const mongoose_1 = require("mongoose");
exports.ServiceHistorySchema = new mongoose_1.Schema({
    serviceRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    historyId: { type: String },
    title: { type: String },
    description: { type: String },
    images: [String],
    completedOn: { type: Date },
}, { timestamps: true });
