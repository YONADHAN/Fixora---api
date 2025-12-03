import { z } from 'zod'

export const toggleServiceBlockZodValidationSchema = z.object({
  params: z.object({
    serviceId: z.string(),
  }),
})
