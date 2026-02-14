import { z } from 'zod'

export const GetAddressBasicSchema = z.object({
  page: z.string().trim().optional(),
  limit: z.string().trim().optional(),
  search: z.string().trim().optional(),
  customerId: z.string().trim().min(1, 'customerId is required'),
})

export const GetAddressRequestSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  customerId: z.string(),
})
