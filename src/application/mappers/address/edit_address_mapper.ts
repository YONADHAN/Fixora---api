export class EditAddressMapper {
  static toDTO(
    data: {
      addressId: string
      latitude?: string
      longitude?: string
    } & Record<string, any>
  ) {
    const dto: any = {
      addressId: data.addressId,
    }

    const fields = [
      'label',
      'addressType',
      'isDefault',
      'isActive',
      'contactName',
      'contactPhone',
      'addressLine1',
      'addressLine2',
      'landmark',
      'city',
      'state',
      'country',
      'zipCode',
      'instructions',
    ]

    for (const field of fields) {
      if (data[field] !== undefined) {
        dto[field] = data[field]
      }
    }

    if (data.latitude && data.longitude) {
      dto.geoLocation = {
        type: 'Point' as const,
        coordinates: [Number(data.longitude), Number(data.latitude)],
      }
    }

    return dto
  }
}
