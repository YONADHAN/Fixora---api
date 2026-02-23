import { z } from 'zod'

export const EditAddressBasicSchema = z.object({
  addressId: z.string().trim().min(1, 'addressId is required'),

  label: z.string().trim().optional(),
  addressType: z.enum(['home', 'office', 'other']).optional(),

  contactName: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),

  addressLine1: z.string().trim().optional(),
  addressLine2: z.string().trim().optional(),
  landmark: z.string().trim().optional(),

  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
  zipCode: z.string().trim().optional(),

  instructions: z.string().trim().optional(),

  latitude: z.string().trim().optional(),
  longitude: z.string().trim().optional(),

  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export const EditAddressRequestSchema = z.object({
  addressId: z.string(),

  label: z.string().optional(),
  addressType: z.enum(['home', 'office', 'other']).optional(),

  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),

  contactName: z.string().optional(),
  contactPhone: z.string().optional(),

  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),

  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),

  instructions: z.string().optional(),

  geoLocation: z
    .object({
      type: z.literal('Point'),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
})
