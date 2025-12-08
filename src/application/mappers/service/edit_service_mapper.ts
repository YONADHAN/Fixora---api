import {
  editServiceNestedZodSchemaForPricing,
  editServiceNestedZodSchemaForSchedule,
  editServiceNestedZodSchemaForServiceVariants,
} from '../../../presentation/validations/service/edit_service.schema'
import { recurrenceType } from '../../../shared/constants'

interface editServiceRequestMapperDTO {
  vendorId: string
  serviceId: string
  subServiceCategoryId: string
  name: string
  description?: string
  serviceVariants?: string
  pricing: string
  schedule: string
  files: { mimetype: string; size: number }[]
}
export class EditServiceRequestMapper {
  static toDTO(payload: editServiceRequestMapperDTO): any {
    const pasrsedServiceVariants = payload.serviceVariants
      ? JSON.parse(payload.serviceVariants)
      : []

    const parsedPricing = payload.pricing ? JSON.parse(payload.pricing) : {}
    const parsedSchedule = payload.schedule ? JSON.parse(payload.schedule) : {}

    editServiceNestedZodSchemaForServiceVariants.parse(pasrsedServiceVariants)
    editServiceNestedZodSchemaForPricing.parse(parsedPricing)
    editServiceNestedZodSchemaForSchedule.parse(parsedSchedule)

    const dailyWorkingWindows = parsedSchedule.dailyWorkingWindows || []

    const weeklyWorkingDays =
      parsedSchedule.weeklyWorkingDays?.map(Number) || []

    const monthlyWorkingDates =
      parsedSchedule.monthlyWorkingDates?.map(Number) || []

    const overrideBlock =
      parsedSchedule.overrideBlock?.map((b: any) => ({
        startDateTime: new Date(b.startDateTime),
        endDateTime: new Date(b.endDateTime),
        reason: b.reason ?? '',
      })) || []

    const overrideCustom =
      parsedSchedule.overrideCustom?.map((c: any) => ({
        startDateTime: new Date(c.startDateTime),
        endDateTime: new Date(c.endDateTime),
        startTime: c.startTime,
        endTime: c.endTime,
      })) || []

    const mainImage = payload.files?.[0] || null

    return {
      serviceId: payload.serviceId,
      vendorId: payload.vendorId,
      subServiceCategoryId: payload.subServiceCategoryId,

      name: payload.name,
      description: payload.description ?? '',

      serviceVariants: pasrsedServiceVariants.map((v: any) => ({
        name: v.name,
        description: v.description,
        price: v.price !== undefined ? Number(v.price) : undefined,
      })),

      pricing: {
        pricePerSlot: Number(parsedPricing.pricePerSlot),
        advanceAmountPerSlot: Number(parsedPricing.advanceAmountPerSlot),
      },

      mainImage,

      schedule: {
        visibilityStartDate: new Date(parsedSchedule.visibilityStartDate),
        visibilityEndDate: new Date(parsedSchedule.visibilityEndDate),

        dailyWorkingWindows,
        slotDurationMinutes: Number(parsedSchedule.slotDurationMinutes),

        recurrenceType: parsedSchedule.recurrenceType as recurrenceType,

        weeklyWorkingDays,
        monthlyWorkingDates,

        overrideBlock,
        overrideCustom,
      },
    }
  }
}
