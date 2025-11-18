import { z } from 'zod'

import { passwordSchema } from '../password_validation'
const strongEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const RegistrationSchema = z.object({
  email: z
    .string()
    .regex(strongEmailRegex, { message: 'Invalid email format' })
    .trim(),
  password: passwordSchema,
})
