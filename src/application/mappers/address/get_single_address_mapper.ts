import { IAddressEntity } from '../../../domain/models/address_entity'

export class GetSingleAddressResponseMapper {
  static toDTO(address: IAddressEntity) {
    const data = {
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
    }
    return data
  }
}
