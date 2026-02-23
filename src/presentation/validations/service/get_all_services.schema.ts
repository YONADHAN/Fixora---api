import { z } from 'zod'

export const getAllServicesZodValidationSchema = z.object({
  query: z.object({
    page: z.string().trim(),
    limit: z.string().trim(),
    search: z.string().trim(),
    vendorId: z.string().trim(),
  }),
})
