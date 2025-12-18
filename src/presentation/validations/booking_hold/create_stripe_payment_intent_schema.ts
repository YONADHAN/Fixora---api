import { z } from 'zod'

export const createStripePaymentIntentSchema = z
  .string()
  .trim()
  .min(1, 'The hold Id should not be empty.')
