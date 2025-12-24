export interface GetAddressRequestDTO {
  page: number
  limit: number
  search?: string
  customerId: string
}

export interface GetAddressResponseDTO {
  data: {
    addressId: string

    label: string
    addressType: 'home' | 'office' | 'other'
    isDefault: boolean

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

    geoLocation: {
      type: 'Point'
      coordinates: [number, number]
    }

    location?: {
      name?: string
      displayName?: string
    }

    createdAt?: Date
    updatedAt?: Date
  }[]

  currentPage: number
  totalPages: number
}
export interface AddAddressRequestDTO {
  customerId: string

  label: string
  addressType: 'home' | 'office' | 'other'

  isDefault: boolean

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

  geoLocation: {
    type: 'Point'
    coordinates: [number, number]
  }

  location?: {
    name?: string
    displayName?: string
  }
}
export interface EditAddressRequestDTO {
  addressId: string

  label?: string
  addressType?: 'home' | 'office' | 'other'

  isDefault?: boolean
  isActive?: boolean

  contactName?: string
  contactPhone?: string

  addressLine1?: string
  addressLine2?: string
  landmark?: string

  city?: string
  state?: string
  country?: string
  zipCode?: string

  instructions?: string

  geoLocation?: {
    type: 'Point'
    coordinates: [number, number]
  }
}

export interface SetDefaultAddressRequestDTO {
  addressId: string
}

export interface DeleteaddressDTO {
  addressId: string
}

export interface GetSingleAddressRequestDTO {
  addressId: string
}

export interface GetSingleAddressResponseDTO {}
