"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyBookingsRequestSchema = void 0;
const zod_1 = require("zod");
exports.getMyBookingsRequestSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(10),
    search: zod_1.z.string().optional().default(''),
    role: zod_1.z.string(),
    userId: zod_1.z.string(),
});
