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
