import z from 'zod'
import { CreateBookingHoldBasicSchema } from '../../../presentation/validations/booking_hold/create_booking_hold_schema'
import { IBookingHoldEntity } from '../../../domain/models/booking_hold_entity'
import { ResponseCreateBookingHoldDTO } from '../../dtos/booking_hold_dto'

type BasicInput = z.infer<typeof CreateBookingHoldBasicSchema>

export class CreateBookingHoldRequestMapper {
  static toDTO(basic: BasicInput) {
    return {
      serviceId: basic.serviceId.trim(),

      paymentMethod: basic.paymentMethod,

      slots: basic.slots.map((slot) => ({
        date: slot.date,
        start: slot.start,
        end: slot.end,

        pricePerSlot: Number(slot.pricePerSlot),
        advancePerSlot: Number(slot.advancePerSlot),

        variant: slot.variant
          ? {
              name: slot.variant.name?.trim(),
              price: slot.variant.price,
            }
          : undefined,
      })),
    }
  }
}

export class CreateBookingHoldResponseMapper {
  static toDTO(response: IBookingHoldEntity): ResponseCreateBookingHoldDTO {
    return {
      holdId: response.holdId,
      pricing: {
        totalAmount: response.pricing.totalAmount,
        advanceAmount: response.pricing.advanceAmount,
        remainingAmount: response.pricing.remainingAmount,
      },
      expiresAt: response.expiresAt,
    }
  }
}
