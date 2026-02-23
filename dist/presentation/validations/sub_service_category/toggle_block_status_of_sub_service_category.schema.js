"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleBlockStatusOfSubServiceCategoryZodValidationSchema = void 0;
const zod_1 = require("zod");
exports.ToggleBlockStatusOfSubServiceCategoryZodValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        subServiceCategoryId: zod_1.z.string(),
        blockStatus: zod_1.z.enum(['active', 'blocked']),
    }),
});
