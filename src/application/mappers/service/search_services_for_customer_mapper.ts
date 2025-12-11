import { IServiceEntity } from '../../../domain/models/service_entity'

import { recurrenceType } from '../../../shared/constants'

interface Query {
  subServiceCategoryId: string
  search: string

  minPrice?: number
  maxPrice?: number

  availableFrom?: Date
  availableTo?: Date

  workStartTime?: string
  workEndTime?: string

  recurrenceType?: recurrenceType
  weeklyDays?: number[]

  page: number
  limit: number
}

interface RawQuery {
  subServiceCategoryId: string
  search: string

  minPrice?: string
  maxPrice?: string

  availableFrom?: string
  availableTo?: string

  workStartTime?: string
  workEndTime?: string

  recurrenceType?: recurrenceType
  weeklyDays?: string // "1,2,3"

  page: string
  limit: string
}

export class RequestSearchServicesForCustomerRequestMapper {
  static toDTO(validated: RawQuery): Query {
    const minPrice = validated.minPrice ? Number(validated.minPrice) : undefined
    const maxPrice = validated.maxPrice ? Number(validated.maxPrice) : undefined

    const page = Math.max(1, Number(validated.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(validated.limit) || 10))

    const result = {
      subServiceCategoryId: validated.subServiceCategoryId.trim(),
      search: validated.search.trim(),

      minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,

      availableFrom: validated.availableFrom
        ? new Date(validated.availableFrom)
        : undefined,

      availableTo: validated.availableTo
        ? new Date(validated.availableTo)
        : undefined,

      workStartTime: validated.workStartTime,
      workEndTime: validated.workEndTime,

      recurrenceType: validated.recurrenceType,

      weeklyDays: validated.weeklyDays
        ? validated.weeklyDays
            .split(',')
            .map(Number)
            .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6)
        : undefined,

      page,
      limit,
    }

    return result
  }
}

export class SearchServicesForCustomersResponseMapper {
  static toDTO(response: {
    data: IServiceEntity[]
    totalPages: number
    currentPage: number
  }) {
    return {
      data: response.data.map((item) => ({
        serviceId: item.serviceId,
        name: item.name,
        description: item.description ?? '',
        serviceVariants:
          item.serviceVariants?.map((v) => ({
            name: v.name,
            description: v.description ?? '',
            price: v.price ?? 0,
          })) ?? [],
        pricing: item.pricing,
        mainImage: item.mainImage,
        schedule: item.schedule,
        vendor: item.populatedValues?.vendor ?? null,
        subServiceCategory: item.populatedValues?.subServiceCategory ?? null,
      })),
      totalPages: response.totalPages,
      currentPage: response.currentPage,
    }
  }
}
