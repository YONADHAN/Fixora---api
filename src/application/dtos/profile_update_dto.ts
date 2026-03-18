

export interface ProfileUpdateDTO {
  name?: string
  email?: string
  phone?: string

  geoLocation?: {
    type: 'Point'
    coordinates: [number, number]
  }

  location?: {
    name?: string
    displayName?: string
    zipCode?: string
  }

  profileImage?: string
}