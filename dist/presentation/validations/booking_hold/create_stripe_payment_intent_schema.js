"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripePaymentIntentSchema = void 0;
const zod_1 = require("zod");
exports.createStripePaymentIntentSchema = zod_1.z
    .string()
    .trim()
    .min(1, 'The hold Id should not be empty.');
