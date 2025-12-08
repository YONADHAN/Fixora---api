import {
  createServiceNestedZodSchemaForServiceVariants,
  createServiceNestedZodSchemaForPricing,
  createServiceNestedZodSchemaForSchedule,
} from '../../../presentation/validations/service/create_service.schema'

import { recurrenceType } from '../../../shared/constants'

export class CreateServiceRequestMapper {
  static toDTO({ rawData, files }: any) {
    // ------------------------------
    // 1. Parse JSON
    // ------------------------------
    const parsedServiceVariants = rawData.serviceVariants
      ? JSON.parse(rawData.serviceVariants)
      : []

    const parsedPricing = rawData.pricing ? JSON.parse(rawData.pricing) : {}

    const parsedSchedule = rawData.schedule ? JSON.parse(rawData.schedule) : {}

    // ------------------------------
    // 2. VALIDATE NESTED STRUCTURES
    // ------------------------------
    createServiceNestedZodSchemaForServiceVariants.parse(parsedServiceVariants)
    createServiceNestedZodSchemaForPricing.parse(parsedPricing)
    createServiceNestedZodSchemaForSchedule.parse(parsedSchedule)

    // ------------------------------
    // 3. Convert fields
    // ------------------------------
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

    // ------------------------------
    // 4. Main Image
    // ------------------------------
    const mainImage = files?.[0] || null

    // ------------------------------
    // 5. Final DTO
    // ------------------------------
    return {
      vendorId: rawData.vendorId,
      subServiceCategoryId: rawData.subServiceCategoryId,

      name: rawData.name,
      description: rawData.description ?? '',

      serviceVariants: parsedServiceVariants,

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

      isActiveStatusByVendor: true,
      isActiveStatusByAdmin: true,
      adminStatusNote: '',
    }
  }
}
