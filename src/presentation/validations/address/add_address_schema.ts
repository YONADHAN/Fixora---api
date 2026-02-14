import { z } from 'zod'

export const AddAddressBasicSchema = z.object({
  customerId: z.string().trim().min(1, 'customerId is required'),

  label: z.string().trim().min(1, 'label is required'),
  addressType: z.enum(['home', 'office', 'other']),

  contactName: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),

  addressLine1: z.string().trim().min(1, 'addressLine1 is required'),
  addressLine2: z.string().trim().optional(),
  landmark: z.string().trim().optional(),

  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
  zipCode: z.string().trim().optional(),

  instructions: z.string().trim().optional(),

  latitude: z.string().trim().min(1, 'latitude is required'),
  longitude: z.string().trim().min(1, 'longitude is required'),

  isDefault: z.boolean().optional(),
})

export const AddAddressRequestSchema = z.object({
  customerId: z.string(),

  label: z.string(),
  addressType: z.enum(['home', 'office', 'other']),

  isDefault: z.boolean().optional().default(false),

  contactName: z.string().optional(),
  contactPhone: z.string().optional(),

  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),

  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),

  instructions: z.string().optional(),

  geoLocation: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  }),

  location: z
    .object({
      name: z.string().optional(),
      displayName: z.string().optional(),
    })
    .optional(),
})
