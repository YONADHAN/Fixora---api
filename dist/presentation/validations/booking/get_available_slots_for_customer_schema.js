"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAvailableSlotsForCustomerRequestSchema = exports.GetAvailableSlotsForCustomerBasicSchema = void 0;
const zod_1 = require("zod");
exports.GetAvailableSlotsForCustomerBasicSchema = zod_1.z.object({
    month: zod_1.z.string().trim().min(1, 'month is required'),
    year: zod_1.z.string().trim().min(1, 'year is required'),
    serviceId: zod_1.z.string().trim().min(1, 'serviceId is required'),
});
exports.GetAvailableSlotsForCustomerRequestSchema = zod_1.z.object({
    month: zod_1.z
        .number()
        .int()
        .min(0, 'month must be between 0 and 11')
        .max(11, 'month must be between 0 and 11'),
    year: zod_1.z.number().int().min(1970, 'year must be valid'),
    serviceId: zod_1.z.string(),
});
