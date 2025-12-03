import { z } from 'zod'

export const editServiceZodValidationSchema = z.object({
  params: z.object({
    serviceId: z.string().uuid('Invalid service ID'),
  }),

  body: z.object({
    title: z.string().trim().min(3).optional(),
    description: z.string().trim().min(3).optional(),

    pricing: z
      .object({
        pricePerSlot: z.string().optional(),
        isAdvanceRequired: z.enum(['true', 'false']).optional(),
        advanceAmountPerSlot: z.string().optional(),
        currency: z.string().optional(),
      })
      .optional(),

    isActiveStatusByVendor: z.enum(['true', 'false']).optional(),
    adminStatusNote: z.string().optional(),

    schedule: z
      .object({
        visibilityStartDate: z.string().optional(),
        visibilityEndDate: z.string().optional(),

        workStartTime: z.string().optional(),
        workEndTime: z.string().optional(),

        slotDurationMinutes: z.string().optional(),

        recurrenceType: z.string().optional(),

        weeklyWorkingDays: z.string().optional(),
        monthlyWorkingDates: z.string().optional(),
        holidayDates: z.string().optional(),
      })
      .optional(),
  }),

  files: z
    .array(
      z.object({
        mimetype: z.string(),
        size: z.number(),
      })
    )
    .optional(),
})
