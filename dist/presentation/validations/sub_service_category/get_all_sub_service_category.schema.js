"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubServiceCategoriesZodValidationSchema = void 0;
const zod_1 = require("zod");
exports.getAllSubServiceCategoriesZodValidationSchema = zod_1.z.object({
    page: zod_1.z.string(),
    limit: zod_1.z.string(),
    search: zod_1.z.string().optional(),
});
