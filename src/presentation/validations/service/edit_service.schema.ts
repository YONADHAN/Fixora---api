import { z } from 'zod'
export const editServiceZodValidationSchema = z.object({
  serviceId: z.string().min(1),

  subServiceCategoryId: z.string().min(1),

  name: z.string().min(3),

  description: z.string().optional(),

  'pricing.pricePerSlot': z.string(),
  'pricing.advanceAmountPerSlot': z.string(),

  'schedule.visibilityStartDate': z.string(),
  'schedule.visibilityEndDate': z.string(),

  'schedule.dailyWorkingWindows[0].startTime': z.string(),
  'schedule.dailyWorkingWindows[0].endTime': z.string(),

  'schedule.slotDurationMinutes': z.string(),
  'schedule.recurrenceType': z.enum(['daily', 'weekly', 'monthly']),

  files: z
    .array(
      z.object({
        mimetype: z.string(),
        size: z.number(),
      })
    )
    .optional(),
})

// export const editServiceZodValidationSchema = z.object({
//   serviceId: z.string().min(1, 'Service Id is required'),

//   subServiceCategoryId: z.string().min(1, 'Sub category is required'),

//   name: z.string().trim().min(3, 'Name is required'),

//   description: z.string().trim().optional(),

//   serviceVariants: z.string().optional(),

//   pricing: z.string().min(1, 'Pricing is required'),

//   schedule: z.string().min(1, 'Schedule is required'),

//   files: z
//     .array(
//       z.object({
//         mimetype: z.string(),
//         size: z.number(),
//       })
//     )
//     .min(1, 'At least 1 image is required')
//     .max(5, 'Maximum 5 images allowed')
//     .refine(
//       (files) =>
//         files.every((f) =>
//           ['image/jpeg', 'image/jpg', 'image/png'].includes(f.mimetype)
//         ),
//       'Only JPG, JPEG, or PNG allowed'
//     )
//     .refine(
//       (files) => files.every((f) => f.size <= 2 * 1024 * 1024),
//       'Each image must be < 2MB'
//     ),
// })

// //Nested Schemas
// export const editServiceNestedZodSchemaForServiceVariants = z.array(
//   z.object({
//     name: z.string().min(1, 'Service Variants name is required.'),
//     description: z.string().optional(),
//     price: z.number().optional(),
//   })
// )

// export const editServiceNestedZodSchemaForPricing = z.object({
//   pricePerSlot: z.number().min(1, 'Price required'),
//   advanceAmountPerSlot: z.number().min(0),
// })

// export const editServiceNestedZodSchemaForSchedule = z.object({
//   visibilityStartDate: z.string().min(1),
//   visibilityEndDate: z.string().min(1),

//   dailyWorkingWindows: z.array(
//     z.object({
//       startTime: z.string(),
//       endTime: z.string(),
//     })
//   ),

//   slotDurationMinutes: z.number().min(1),

//   recurrenceType: z.enum(['daily', 'weekly', 'monthly']),

//   weeklyWorkingDays: z.array(z.number()).optional(),
//   monthlyWorkingDates: z.array(z.number()).optional(),

//   overrideBlock: z
//     .array(
//       z.object({
//         startDateTime: z.string(),
//         endDateTime: z.string(),
//         reason: z.string().optional(),
//       })
//     )
//     .optional(),

//   overrideCustom: z
//     .array(
//       z.object({
//         startDateTime: z.string(),
//         endDateTime: z.string(),
//         startTime: z.string().optional(),
//         endTime: z.string().optional(),
//         customSlotDuration: z.number().optional(),
//       })
//     )
//     .optional(),
// })
