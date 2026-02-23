import { statusTypes } from '../constants'

export interface IVendorPopulated {
  _id: any
  name: string
  userId: string
  profileImage?: string
  geoLocation?: { type?: 'Point'; coordinates?: number[] }
  location?: { name?: string; displayName?: string; zipCode?: string }
  status?: statusTypes
}

export interface ISubServiceCategoryPopulated {
  _id: any
  subServiceCategoryId: string
  name: string
  isActive: statusTypes
}
