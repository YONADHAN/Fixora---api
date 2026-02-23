"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleServiceBlockZodValidationSchema = void 0;
const zod_1 = require("zod");
exports.toggleServiceBlockZodValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        serviceId: zod_1.z.string(),
    }),
});
