import { recurrenceType, statusTypes } from '../../shared/constants'

export interface IServiceEntity {
  _id?: string
  serviceId: string
  vendorRef: string
  subServiceCategoryRef: string

  name: string

  description?: string
  serviceVariants?: {
    name: string
    description?: string
    price?: number
  }[]
  pricing: {
    pricePerSlot: number
    advanceAmountPerSlot: number
  }
  mainImage: string

  isActiveStatusByAdmin: boolean
  isActiveStatusByVendor: boolean
  adminStatusNote?: string

  schedule: {
    visibilityStartDate?: Date
    visibilityEndDate?: Date

    dailyWorkingWindows: {
      startTime: string
      endTime: string
    }[]

    slotDurationMinutes: number

    recurrenceType?: recurrenceType
    weeklyWorkingDays?: number[]
    monthlyWorkingDates?: number[]

    overrideBlock?: {
      startDateTime: Date
      endDateTime: Date
      reason?: string
    }[]

    overrideCustom?: {
      startDateTime: Date
      endDateTime: Date
      startTime?: string
      endTime?: string
    }[]
  }

  populatedValues?: {
    vendor?: {
      name: string
      userId: string
      profileImage?: string
      geoLocation?: {
        type?: 'Point'
        coordinates?: number[]
      }
      location?: {
        name?: string
        displayName?: string
        zipCode?: string
      }
      status?: statusTypes
    }

    subServiceCategory?: {
      subServiceCategoryId: string
      name: string
      isActive: statusTypes
    }
  }

  createdAt?: Date
  updatedAt?: Date
}
