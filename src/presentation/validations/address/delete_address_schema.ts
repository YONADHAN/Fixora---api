import { z } from 'zod'

export const DeleteAddressBasicSchema = z.object({
  addressId: z.string().trim().min(1, 'addressId is required'),
})
export const DeleteAddressRequestSchema = z.object({
  addressId: z.string(),
})
