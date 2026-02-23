import { z } from 'zod'

export const getAllSubServiceCategoriesZodValidationSchema = z.object({
  page: z.string(),
  limit: z.string(),
  search: z.string().optional(),
})
