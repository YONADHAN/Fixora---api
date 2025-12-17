import { z } from 'zod'

export const CreateBookingHoldBasicSchema = z.object({
  serviceId: z.string().min(1),

  paymentMethod: z.literal('stripe'),

  slots: z.array(
    z.object({
      date: z.string().min(1),
      start: z.string().min(1),
      end: z.string().min(1),

      pricePerSlot: z.number(),
      advancePerSlot: z.number(),

      variant: z
        .object({
          name: z.string().optional(),
          price: z.number().optional(),
        })
        .optional(),
    })
  ),
})

export const CreateBookingHoldRequestSchema = z
  .object({
    serviceId: z.string().min(1),

    paymentMethod: z.literal('stripe'),

    slots: z
      .array(
        z.object({
          date: z.string().min(1),
          start: z.string().min(1),
          end: z.string().min(1),

          pricePerSlot: z.number().min(0),
          advancePerSlot: z.number().min(0),

          variant: z
            .object({
              name: z.string().optional(),
              price: z.number().min(0).optional(),
            })
            .optional(),
        })
      )
      .min(1),
  })
  .superRefine((data, ctx) => {
    data.slots.forEach((slot, index) => {
      if (slot.advancePerSlot > slot.pricePerSlot) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['slots', index, 'advancePerSlot'],
          message: 'Advance cannot be greater than price',
        })
      }
    })
  })
