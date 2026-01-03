"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBookingResponseMapper = void 0;
class GetBookingResponseMapper {
    static toDTO(payload) {
        const filteredData = payload.data.map((booking) => ({
            bookingId: booking.bookingId,
            bookingGroupId: booking.bookingGroupId,
            paymentStatus: booking.paymentStatus,
            serviceStatus: booking.serviceStatus,
            cancelInfo: booking.cancelInfo
                ? {
                    cancelledByRole: booking.cancelInfo.cancelledByRole,
                    reason: booking.cancelInfo.reason,
                }
                : undefined,
        }));
        return {
            data: filteredData,
            totalPages: payload.totalPages,
            currentPage: payload.currentPage,
        };
    }
}
exports.GetBookingResponseMapper = GetBookingResponseMapper;
