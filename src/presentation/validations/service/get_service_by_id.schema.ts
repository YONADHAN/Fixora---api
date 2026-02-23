import { z } from 'zod'

export const GetServiceByIdZodValidationSchema = z.object({
  params: z.object({
    serviceId: z.string().trim(),
  }),
})
