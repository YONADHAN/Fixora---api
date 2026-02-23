"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleVerificationStatusOfSubServiceCategoryZodValidationSchema = void 0;
const zod_1 = require("zod");
exports.ToggleVerificationStatusOfSubServiceCategoryZodValidationSchema = zod_1.z.object({
    payload: zod_1.z.object({
        subServiceCategoryId: zod_1.z.string(),
        verificationStatus: zod_1.z.enum(['pending', 'accepted', 'rejected']),
    }),
});
