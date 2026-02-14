"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubServiceCategoryZodValidationSchema = void 0;
const zod_1 = require("zod");
exports.createSubServiceCategoryZodValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        description: zod_1.z.string(),
        serviceCategoryId: zod_1.z.string(),
    }),
    file: zod_1.z
        .any()
        .refine((file) => !!file, 'Image is required')
        .refine((file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype), 'Only JPG, JPEG, PNG images are allowed')
        .refine((file) => file.size <= 2 * 1024 * 1024, 'Image size must be less than 2MB'),
});
