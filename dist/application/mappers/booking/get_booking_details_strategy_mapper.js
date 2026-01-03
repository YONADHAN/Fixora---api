"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBookingDetailsForCustomerResponseMapper = exports.GetBookingDetailsForVendorResponseMapper = void 0;
class GetBookingDetailsForVendorResponseMapper {
    static toDTO(booking, service, customer) {
        return {
            booking: {
                bookingId: booking.bookingId,
                bookingGroupId: booking.bookingGroupId,
                date: booking.date,
                slotStart: booking.slotStart,
                slotEnd: booking.slotEnd,
                paymentStatus: booking.paymentStatus,
                serviceStatus: booking.serviceStatus,
                cancelInfo: booking.cancelInfo,
            },
            service: {
                serviceId: service.serviceId,
                name: service.name,
                pricing: service.pricing,
                variants: service.serviceVariants,
            },
            customer: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                profileImage: customer.profileImage,
                location: customer.location,
            },
        };
    }
}
exports.GetBookingDetailsForVendorResponseMapper = GetBookingDetailsForVendorResponseMapper;
class GetBookingDetailsForCustomerResponseMapper {
    static toDTO(booking, vendor, service) {
        return {
            booking: {
                bookingId: booking.bookingId,
                bookingGroupId: booking.bookingGroupId,
                date: booking.date,
                slotStart: booking.slotStart,
                slotEnd: booking.slotEnd,
                paymentStatus: booking.paymentStatus,
                serviceStatus: booking.serviceStatus,
                cancelInfo: booking.cancelInfo,
            },
            service: service
                ? {
                    serviceId: service.serviceId,
                    name: service.name,
                    description: service.description,
                    pricing: service.pricing,
                    variants: service.serviceVariants,
                    mainImage: service.mainImage,
                }
                : null,
            vendor: vendor
                ? {
                    name: vendor.name,
                    profileImage: vendor.profileImage,
                    location: vendor.location,
                }
                : null,
        };
    }
}
exports.GetBookingDetailsForCustomerResponseMapper = GetBookingDetailsForCustomerResponseMapper;
