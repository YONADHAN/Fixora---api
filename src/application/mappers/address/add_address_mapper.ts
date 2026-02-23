export class AddAddressMapper {
  static toDTO(data: {
    customerId: string
    label: string
    addressType: 'home' | 'office' | 'other'

    contactName?: string
    contactPhone?: string

    addressLine1: string
    addressLine2?: string
    landmark?: string

    city?: string
    state?: string
    country?: string
    zipCode?: string

    instructions?: string

    latitude: string
    longitude: string

    isDefault?: boolean
  }) {
    return {
      customerId: data.customerId,

      label: data.label,
      addressType: data.addressType,

      isDefault: data.isDefault ?? false,

      contactName: data.contactName,
      contactPhone: data.contactPhone,

      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      landmark: data.landmark,

      city: data.city,
      state: data.state,
      country: data.country,
      zipCode: data.zipCode,

      instructions: data.instructions,

      geoLocation: {
        type: 'Point' as const,
        coordinates: [Number(data.longitude), Number(data.latitude)],
      },
    }
  }
}
