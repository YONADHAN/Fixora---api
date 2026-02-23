import { IBookingEntity } from '../../../domain/models/booking_entity'

export class GetBookingResponseMapper {
  static toDTO(payload: {
    data: IBookingEntity[]
    currentPage: number
    totalPages: number
  }) {
    const filteredData = payload.data.map((booking) => ({
      bookingId: booking.bookingId,
      bookingGroupId: booking.bookingGroupId,
      paymentStatus: booking.paymentStatus,
      serviceStatus: booking.serviceStatus,
      date: booking.date,
      slotStart: booking.slotStart,
      slotEnd: booking.slotEnd,
      serviceName: booking.serviceName,
      slots: booking.slots?.map((slot) => ({
        bookingId: slot.bookingId,
        date: slot.date,
        slotStart: slot.slotStart,
        slotEnd: slot.slotEnd,
        paymentStatus: slot.paymentStatus,
        serviceStatus: slot.serviceStatus,
      })),

      cancelInfo: booking.cancelInfo
        ? {
          cancelledByRole: booking.cancelInfo.cancelledByRole,
          reason: booking.cancelInfo.reason,
        }
        : undefined,
    }))
    return {
      data: filteredData,
      totalPages: payload.totalPages,
      currentPage: payload.currentPage,
    }
  }
}
