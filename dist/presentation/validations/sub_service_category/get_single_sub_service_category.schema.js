"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSingleSubServiceCategoryZodValidationSchema = void 0;
const zod_1 = require("zod");
exports.GetSingleSubServiceCategoryZodValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        subServiceCategoryId: zod_1.z.string(),
    }),
});
