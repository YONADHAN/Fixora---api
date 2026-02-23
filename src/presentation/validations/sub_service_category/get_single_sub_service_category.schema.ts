import { z } from 'zod'
export const GetSingleSubServiceCategoryZodValidationSchema = z.object({
  params: z.object({
    subServiceCategoryId: z.string(),
  }),
})
