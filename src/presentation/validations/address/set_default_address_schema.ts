import { z } from 'zod'

export const SetDefaultAddressBasicSchema = z.object({
  addressId: z.string().trim().min(1, 'addressId is required'),
})

export const SetDefaultAddressRequestSchema = z.object({
  addressId: z.string(),
})
