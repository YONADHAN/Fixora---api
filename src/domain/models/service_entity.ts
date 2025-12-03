import { recurrenceType } from '../../shared/constants'
export interface IServiceEntity {
  _id?: string
  serviceId: string
  vendorRef: string
  subServiceCategoryRef: string

  title: string
  description?: string

  pricing: {
    pricePerSlot: number
    isAdvanceRequired: boolean
    advanceAmountPerSlot: number
    currency?: string
  }

  images: string[]

  isActiveStatusByAdmin: boolean
  isActiveStatusByVendor: boolean
  adminStatusNote?: string

  schedule: {
    visibilityStartDate?: Date
    visibilityEndDate?: Date

    workStartTime?: string
    workEndTime?: string
    slotDurationMinutes?: number

    recurrenceType?: recurrenceType
    weeklyWorkingDays?: number[]
    monthlyWorkingDates?: number[]
    holidayDates?: Date[]
  }

  serviceHistoryRefs?: string[]

  createdAt?: Date
  updatedAt?: Date
}
