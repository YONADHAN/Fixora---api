import { recurrenceType } from '../../shared/constants'

export interface RequestCreateServiceDTO {
  vendorId: string
  subServiceCategoryId: string

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

  mainImage: Express.Multer.File

  isActiveStatusByVendor: boolean
  isActiveStatusByAdmin?: boolean
  adminStatusNote?: string

  schedule: {
    visibilityStartDate: Date
    visibilityEndDate: Date

    dailyWorkingWindows: {
      startTime: string
      endTime: string
    }[]

    slotDurationMinutes: number

    recurrenceType: recurrenceType
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
    name: string
    description?: string
    mainImage: string
    isActiveStatusByVendor: boolean
  }[]
  totalPages: number
  currentPage: number
}

export interface RequestGetServiceByIdDTO {
  serviceId: string
}

export interface ResponseGetServiceByIdDTO {
  serviceId: string
  vendorId: string
  subServiceCategoryId: string

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

  isActiveStatusByVendor: boolean
  isActiveStatusByAdmin: boolean
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
    }
    subServiceCategory?: {
      subServiceCategoryId: string
      name: string
      isActive: string
    }
  }

  createdAt?: Date
  updatedAt?: Date
}

export interface RequestEditServiceDTO {
  serviceId: string
  subServiceCategoryId: string
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

  mainImage: Express.Multer.File

  schedule: {
    visibilityStartDate: Date
    visibilityEndDate: Date

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

export interface RequestToggleBlockServiceDTO {
  serviceId: string
}

export interface ResponseToggleBlockServiceDTO {
  isActiveStatusByVendor: boolean
}
