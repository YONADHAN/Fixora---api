import { Types } from 'mongoose'

export interface AddressMongoBase {
  _id: Types.ObjectId

  addressId: string
  customerId: string

  label: string
  addressType: 'home' | 'office' | 'other'

  isDefault: boolean
  isActive: boolean

  contactName?: string
  contactPhone?: string

  addressLine1: string
  addressLine2?: string
  landmark?: string

  city?: string
  state?: string
  country: string
  zipCode?: string

  instructions?: string

  geoLocation: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
  }

  location?: {
    name?: string
    displayName?: string
  }

  createdAt: Date
  updatedAt: Date
}
