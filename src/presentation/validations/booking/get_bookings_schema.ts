import { z } from 'zod'

export const getMyBookingsRequestSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional().default(''),
  sortOption: z.string().optional().default('latest'),
  role: z.string(),
  filterOption: z.string().optional().default('all'),
  userId: z.string(),
})
