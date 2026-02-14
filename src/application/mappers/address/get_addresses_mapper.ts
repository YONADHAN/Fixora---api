import { IAddressEntity } from '../../../domain/models/address_entity'
import { GetAddressResponseDTO } from '../../dtos/address_dto'

export class GetAddressRequestMapper {
  static toDTO(data: {
    page?: string
    limit?: string
    search?: string
    customerId: string
  }) {
    return {
      page: data.page ? Number(data.page) : 1,
      limit: data.limit ? Number(data.limit) : 10,
      search: data.search?.trim() || undefined,
      customerId: data.customerId,
    }
  }
}

export class GetAddressResponseMapper {
  static toDTO(data: {
    data: IAddressEntity[]
    currentPage: number
    totalPages: number
  }): GetAddressResponseDTO {
    return {
      currentPage: data.currentPage,
      totalPages: data.totalPages,

      data: data.data.map((address) => ({
        addressId: address.addressId,

        label: address.label,
        addressType: address.addressType,
        isDefault: address.isDefault,

        contactName: address.contactName,
        contactPhone: address.contactPhone,

        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        landmark: address.landmark,

        city: address.city,
        state: address.state,
        country: address.country,
        zipCode: address.zipCode,

        instructions: address.instructions,

        geoLocation: address.geoLocation,

        location: address.location,

        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
      })),
    }
  }
}
