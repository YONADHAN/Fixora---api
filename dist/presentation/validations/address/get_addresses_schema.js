"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAddressRequestSchema = exports.GetAddressBasicSchema = void 0;
const zod_1 = require("zod");
exports.GetAddressBasicSchema = zod_1.z.object({
    page: zod_1.z.string().trim().optional(),
    limit: zod_1.z.string().trim().optional(),
    search: zod_1.z.string().trim().optional(),
    customerId: zod_1.z.string().trim().min(1, 'customerId is required'),
});
exports.GetAddressRequestSchema = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
    customerId: zod_1.z.string(),
});
