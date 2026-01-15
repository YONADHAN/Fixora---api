"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBookingResponseMapper = void 0;
class GetBookingResponseMapper {
    static toDTO(payload) {
        const filteredData = payload.data.map((booking) => {
            var _a;
            return ({
                bookingId: booking.bookingId,
                bookingGroupId: booking.bookingGroupId,
                paymentStatus: booking.paymentStatus,
                serviceStatus: booking.serviceStatus,
                date: booking.date,
                slotStart: booking.slotStart,
                slotEnd: booking.slotEnd,
                serviceName: booking.serviceName,
                slots: (_a = booking.slots) === null || _a === void 0 ? void 0 : _a.map((slot) => ({
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
            });
        });
        return {
            data: filteredData,
            totalPages: payload.totalPages,
            currentPage: payload.currentPage,
        };
    }
}
exports.GetBookingResponseMapper = GetBookingResponseMapper;
