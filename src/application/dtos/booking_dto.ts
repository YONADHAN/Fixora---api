import { TRole } from '../../shared/constants'

export type BookingSlotDTO = {
  start: string
  end: string
}

export type BookingAvailabilityDTO = {
  [date: string]: BookingSlotDTO[]
}

export type GetAvailableSlotsForCustomerRequestDTO = {
  month: number
  year: number
  serviceId: string
}
export type GetAvailableSlotsForCustomerResponseDTO = {
  [date: string]: {
    start: string
    end: string
  }[]
}

export type GetBookingRequestDTO = {
  page: number
  limit: number
  search: string
  userId: string
  role: string
}

export type GetBookingResponseDTO = {
  data: {
    bookingId: string
    bookingGroupId: string
    paymentStatus: string
    serviceStatus: string
    serviceName?: string
    cancelInfo?: {
      cancelledByRole?: TRole
      reason?: string
    }
  }[]
  totalPages: number
  currentPage: number
}

export type CancelBookingRequestDTO = {
  bookingId: string
  userId: string
  role: TRole
  reason: string
}
export interface GetBookingDetailsRequestDTO {
  bookingId: string
  userId: string
  role: TRole
}

export interface GetBookingDetailsForVendorStrategyResponseDTO {
  booking: {
    bookingId: string
    bookingGroupId: string
    date: string
    slotStart?: Date
    slotEnd?: Date
    paymentStatus: string
    serviceStatus: string
    cancelInfo?: {
      cancelledByRole?: string
      reason?: string
      cancelledAt?: Date
    }
  }

  service: {
    serviceId: string
    name: string
    pricing: {
      pricePerSlot: number
      advanceAmountPerSlot: number
    }
    description?: string
    price?: number
    variants?: {
      name: string
      description?: string
      price?: number
    }[]
    mainImage?: string
  }

  customer: {
    name: string
    email: string
    phone?: string
    profileImage?: string
    location?: {
      name?: string
      displayName?: string
      zipCode?: string
    }
    geoLocation?: {
      coordinates: number[]
    }
    bookingAddress?: {
      name?: string
      addressLine1?: string
      addressLine2?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
      location?: {
        name?: string
        displayName?: string
      }
      geoLocation?: {
        coordinates: number[]
      }
    }
  }
}

export interface GetBookingDetailsForCustomerStrategyResponseDTO {
  booking: {
    bookingId: string
    bookingGroupId: string
    date: string
    slotStart?: Date
    slotEnd?: Date
    paymentStatus: string
    serviceStatus: string
    cancelInfo?: {
      cancelledByRole?: string
      reason?: string
      cancelledAt?: Date
    }
  }

  service: {
    serviceId: string
    name: string
    description?: string
    pricing: {
      pricePerSlot: number
      advanceAmountPerSlot: number
    }
    variants?: {
      name: string
      description?: string
      price?: number
    }[]
    mainImage: string
  } | null

  vendor: {
    name: string
    email: string
    phone?: string
    profileImage?: string
    location?: {
      name?: string
      displayName?: string
      zipCode?: string
    }
    geoLocation?: {
      coordinates: number[]
    }
  } | null
}

export interface GetBookingByPaymentIdResponseDTO {
  bookingId: string
  bookingGroupId: string
}
