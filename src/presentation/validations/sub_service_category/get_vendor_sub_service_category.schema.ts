import { z } from 'zod'

export const getVendorSubServiceCategoriesZodValidationSchema = z.object({
  page: z.string(),
  limit: z.string(),
  search: z.string(),
})
