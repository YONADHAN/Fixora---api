import { z } from 'zod'

export const GetAllSubServiceCategoriesBasedOnServiceCategoryIdZodValidationSchema =
  z.object({
    query: z.object({
      serviceCategoryId: z.string(),
      page: z.string(),
      limit: z.string(),
      search: z.string(),
    }),
  })
