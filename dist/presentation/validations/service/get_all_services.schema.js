"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllServicesZodValidationSchema = void 0;
const zod_1 = require("zod");
exports.getAllServicesZodValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().trim(),
        limit: zod_1.z.string().trim(),
        search: zod_1.z.string().trim(),
        vendorId: zod_1.z.string().trim(),
    }),
});
