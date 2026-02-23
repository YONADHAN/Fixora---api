import z from 'zod'

export const SearchCustomerServicesBasicSchema = z.object({
  subServiceCategoryId: z.string().trim().min(1),

  search: z.string().trim().default(''),

  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),

  availableFrom: z.string().optional(),
  availableTo: z.string().optional(),

  workStartTime: z.string().optional(),
  workEndTime: z.string().optional(),

  recurrenceType: z.enum(['daily', 'weekly', 'monthly']).optional(),

  weeklyDays: z.string().optional(), // "1,3,5"

  page: z.string().default('1'),
  limit: z.string().default('10'),
})

export const SearchCustomerServicesDTOSchema = z.object({
  subServiceCategoryId: z.string(),

  search: z.string(),

  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),

  availableFrom: z.date().optional(),
  availableTo: z.date().optional(),

  workStartTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  workEndTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),

  recurrenceType: z.enum(['daily', 'weekly', 'monthly']).optional(),

  weeklyDays: z.array(z.number().int().min(0).max(6)).optional(),

  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
})
