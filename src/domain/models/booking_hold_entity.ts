export interface IBookingHoldEntity {
  _id?: string

  holdId: string

  serviceRef: string
  vendorRef: string
  customerRef: string

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

  createdAt?: Date
  updatedAt?: Date
}
