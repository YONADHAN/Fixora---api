import { IBookingEntity } from '../../../domain/models/booking_entity'
import { IServiceEntity } from '../../../domain/models/service_entity'
import { ICustomerEntity } from '../../../domain/models/customer_entity'
import {
  GetBookingDetailsForCustomerStrategyResponseDTO,
  GetBookingDetailsForVendorStrategyResponseDTO,
} from '../../dtos/booking_dto'
import { IVendorEntity } from '../../../domain/models/vendor_entity'

export class GetBookingDetailsForVendorResponseMapper {
  static toDTO(
    booking: IBookingEntity,
    service: IServiceEntity,
    customer: ICustomerEntity
  ): GetBookingDetailsForVendorStrategyResponseDTO {
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
    }
  }
}


export class GetBookingDetailsForCustomerResponseMapper {
  static toDTO(
    booking: IBookingEntity,
    vendor: IVendorEntity | null,
    service: IServiceEntity | null
  ): GetBookingDetailsForCustomerStrategyResponseDTO {
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
    }
  }
}
