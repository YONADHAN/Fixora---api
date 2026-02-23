import { z } from 'zod'

export const GetAvailableSlotsForCustomerBasicSchema = z.object({
  month: z.string().trim().min(1, 'month is required'),
  year: z.string().trim().min(1, 'year is required'),
  serviceId: z.string().trim().min(1, 'serviceId is required'),
})

export const GetAvailableSlotsForCustomerRequestSchema = z.object({
  month: z
    .number()
    .int()
    .min(0, 'month must be between 0 and 11')
    .max(11, 'month must be between 0 and 11'),

  year: z.number().int().min(1970, 'year must be valid'),

  serviceId: z.string(),
})
