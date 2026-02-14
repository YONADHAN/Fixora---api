"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceNestedZodSchemaForSchedule = exports.createServiceNestedZodSchemaForPricing = exports.createServiceNestedZodSchemaForServiceVariants = exports.createServiceZodValidationSchema = void 0;
const zod_1 = require("zod");
exports.createServiceZodValidationSchema = zod_1.z.object({
    subServiceCategoryId: zod_1.z.string().min(1, 'Category is required'),
    name: zod_1.z.string().trim().min(3, 'Name is required'),
    description: zod_1.z.string().trim().optional(),
    serviceVariants: zod_1.z.string().optional(),
    pricing: zod_1.z.string().min(1, 'Pricing is required'),
    schedule: zod_1.z.string().min(1, 'Schedule is required'),
    files: zod_1.z
        .array(zod_1.z.object({
        mimetype: zod_1.z.string(),
        size: zod_1.z.number(),
    }))
        .min(1, 'At least 1 image is required')
        .max(5, 'Maximum 5 images allowed')
        .refine((files) => files.every((f) => ['image/jpeg', 'image/jpg', 'image/png'].includes(f.mimetype)), 'Only JPG, JPEG, or PNG allowed')
        .refine((files) => files.every((f) => f.size <= 2 * 1024 * 1024), 'Each image must be < 2MB'),
});
//Nested Schemas
exports.createServiceNestedZodSchemaForServiceVariants = zod_1.z.array(zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
}));
exports.createServiceNestedZodSchemaForPricing = zod_1.z.object({
    pricePerSlot: zod_1.z.number().min(1, 'Price required'),
    advanceAmountPerSlot: zod_1.z.number().min(0),
});
exports.createServiceNestedZodSchemaForSchedule = zod_1.z.object({
    visibilityStartDate: zod_1.z.string().min(1),
    visibilityEndDate: zod_1.z.string().min(1),
    dailyWorkingWindows: zod_1.z.array(zod_1.z.object({
        startTime: zod_1.z.string(),
        endTime: zod_1.z.string(),
    })),
    slotDurationMinutes: zod_1.z.number().min(1),
    recurrenceType: zod_1.z.enum(['daily', 'weekly', 'monthly']),
    weeklyWorkingDays: zod_1.z.array(zod_1.z.number()).optional(),
    monthlyWorkingDates: zod_1.z.array(zod_1.z.number()).optional(),
    overrideBlock: zod_1.z
        .array(zod_1.z.object({
        startDateTime: zod_1.z.string(),
        endDateTime: zod_1.z.string(),
        reason: zod_1.z.string().optional(),
    }))
        .optional(),
    overrideCustom: zod_1.z
        .array(zod_1.z.object({
        startDateTime: zod_1.z.string(),
        endDateTime: zod_1.z.string(),
        startTime: zod_1.z.string().optional(),
        endTime: zod_1.z.string().optional(),
        customSlotDuration: zod_1.z.number().optional(),
    }))
        .optional(),
});
