import { z } from 'zod'

export const ToggleBlockStatusOfSubServiceCategoryZodValidationSchema =
  z.object({
    params: z.object({
      subServiceCategoryId: z.string(),
      blockStatus: z.enum(['active', 'blocked']),
    }),
  })
