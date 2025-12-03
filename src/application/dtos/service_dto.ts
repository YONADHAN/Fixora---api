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

//Get all services

export interface RequestGetAllServicesDTO {
  page: number
  limit: number
  search?: string
  vendorId: string
}

export interface ResponseGetAllServicesDTO {
  data: {
    serviceId: string
    title: string
    description?: string
    images: string[]
    isActiveStatusByVendor: boolean
  }[]
  totalPages: number
  currentPage: number
}

export interface RequestGetServiceByIdDTO {
  serviceId: string
}

export interface ResponseGetServiceByIdDTO {
  vendorId: string
  subServiceCategoryId: string

  title: string
  description?: string

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

  images: string[]
}

export interface RequestEditServiceDTO {
  title?: string
  description?: string

  pricing?: {
    pricePerSlot?: number
    isAdvanceRequired?: boolean
    advanceAmountPerSlot?: number
    currency?: string
  }

  isActiveStatusByVendor?: boolean
  adminStatusNote?: string

  schedule?: {
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

  images?: Express.Multer.File[]
}

export interface ResponseEditServiceDTO {
  serviceId: string

  title: string
  description: string

  pricing: {
    pricePerSlot: number
    isAdvanceRequired: boolean
    advanceAmountPerSlot: number
    currency: string
  }

  schedule: {
    visibilityStartDate: Date
    visibilityEndDate: Date

    workStartTime: string
    workEndTime: string

    slotDurationMinutes: number
    recurrenceType: recurrenceType

    weeklyWorkingDays: number[]
    monthlyWorkingDates: number[]
    holidayDates: Date[]
  }

  images: string[]

  isActiveStatusByVendor: boolean
  isActiveStatusByAdmin: boolean
  adminStatusNote: string

  createdAt: Date
  updatedAt: Date
}
