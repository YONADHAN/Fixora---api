import { Types } from 'mongoose'

export interface BookingHoldMongoBase {
  _id: Types.ObjectId

  holdId: string

  serviceRef: Types.ObjectId
  vendorRef: Types.ObjectId
  customerRef: Types.ObjectId
  addressId: string

  slots: {
    date: string
    start: string
    end: string

    pricePerSlot: number
    advancePerSlot: number

    variant?: {
      name?: string
      price?: number
    }
  }[]

  pricing: {
    totalAmount: number
    advanceAmount: number
    remainingAmount: number
  }

  paymentMethod: 'stripe'

  stripePaymentIntentId?: string

  status: 'active' | 'completed' | 'expired' | 'failed'

  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}
