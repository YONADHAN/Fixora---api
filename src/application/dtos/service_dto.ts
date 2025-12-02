import { recurrenceType } from '../../shared/constants'

export interface RequestCreateServiceDTO {
  vendorId: string
  subServiceCategoryId: string

  title: string
  description: string

  pricing: {
    pricePerSlot: number
    isAdvanceRequired: boolean
    advanceAmountPerSlot: number
    currency?: string
  }

  isActiveStatusByVendor: boolean
  isActiveStatusByAdmin?: boolean
  adminStatusNote?: string

  schedule: {
    visibilityStartDate: Date
    visibilityEndDate: Date

    workStartTime: string
    workEndTime: string

    slotDurationMinutes: number
    recurrenceType: recurrenceType

    weeklyWorkingDays?: number[]
    monthlyWorkingDates?: number[]
    holidayDates?: Date[]
  }

  images: Express.Multer.File[]
}

export interface ResponseServiceDTO {
  id?: string
  title?: string
  images?: string[]
}
