// src/presentation/validations/service/create_service.schema.ts
import { z } from 'zod'

export const createServiceZodValidationSchema = z.object({
  body: z.object({
    subServiceCategoryId: z
      .string()
      .trim()
      .min(1, 'Sub category ID is required'),

    title: z.string().trim().min(3, 'Title must be at least 3 characters'),
    description: z
      .string()
      .trim()
      .min(3, 'Description must be at least 3 characters'),

    pricing: z.object({
      pricePerSlot: z
        .string()
        .trim()
        .refine((v) => !isNaN(Number(v)), {
          message: 'Price per slot must be numeric',
        }),

      isAdvanceRequired: z.enum(['true', 'false']),

      advanceAmountPerSlot: z
        .string()
        .trim()
        .refine((v) => !isNaN(Number(v)), {
          message: 'Advance amount per slot must be numeric',
        }),

      currency: z.string().trim().optional(),
    }),

    isActiveStatusByVendor: z.enum(['true', 'false']),

    isActiveStatusByAdmin: z.enum(['true', 'false']).optional(),
    adminStatusNote: z.string().optional(),

    schedule: z.object({
      visibilityStartDate: z.string().trim(),
      visibilityEndDate: z.string().trim(),

      workStartTime: z.string().trim().min(1, 'Work start time is required'),
      workEndTime: z.string().trim().min(1, 'Work end time is required'),

      slotDurationMinutes: z
        .string()
        .trim()
        .refine((v) => !isNaN(Number(v)), 'Slot duration must be numeric'),

      recurrenceType: z.string().trim().min(1, 'Recurrence type is required'),

      weeklyWorkingDays: z.string().optional(), // "1,2,3"
      monthlyWorkingDates: z.string().optional(),
      holidayDates: z.string().optional(), // "2025-01-01,2025-01-10"
    }),
  }),

  files: z
    .array(
      z.object({
        mimetype: z.string(),
        size: z.number(),
      })
    )
    .min(1, 'At least one image is required')
    .max(1, 'maximum 1 image can be uploaded')
    .refine(
      (files) =>
        files.every((f) =>
          ['image/jpeg', 'image/jpg', 'image/png'].includes(f.mimetype)
        ),
      'Only JPG, JPEG, and PNG images are allowed'
    )
    .refine(
      (files) => files.every((f) => f.size <= 2 * 1024 * 1024),
      'Each image must be below 2MB'
    ),
})
