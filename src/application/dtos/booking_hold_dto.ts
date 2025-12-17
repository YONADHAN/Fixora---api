export interface RequestCreateBookingHoldDTO {
  serviceId: string
  paymentMethod: 'stripe'
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
}
export interface ResponseCreateBookingHoldDTO {
  holdId: string
  pricing: {
    totalAmount: number
    advanceAmount: number
    remainingAmount: number
  }
  expiresAt: Date
}
