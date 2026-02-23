import { z } from 'zod'

export const ToggleVerificationStatusOfSubServiceCategoryZodValidationSchema =
  z.object({
    payload: z.object({
      subServiceCategoryId: z.string(),
      verificationStatus: z.enum(['pending', 'accepted', 'rejected']),
    }),
  })
