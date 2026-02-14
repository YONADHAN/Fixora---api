import { z } from 'zod'

export const GetSingleAddressSchema = z.object({
  addressId: z.string().trim(),
})
