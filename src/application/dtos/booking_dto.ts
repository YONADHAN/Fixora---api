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
