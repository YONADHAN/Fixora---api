import {
  createServiceNestedZodSchemaForServiceVariants,
  createServiceNestedZodSchemaForPricing,
  createServiceNestedZodSchemaForSchedule,
} from '../../../presentation/validations/service/create_service.schema'

import { recurrenceType } from '../../../shared/constants'
import { z } from 'zod'

type ServiceVariantsType = z.infer<
  typeof createServiceNestedZodSchemaForServiceVariants
>

type PricingType = z.infer<
  typeof createServiceNestedZodSchemaForPricing
>

type ScheduleType = z.infer<
  typeof createServiceNestedZodSchemaForSchedule
>

interface CreateServiceMapperInput {
  rawData: {
    vendorId: string
    subServiceCategoryId: string
    name: string
    description?: string
    serviceVariants?: string
    pricing: string
    schedule: string
  }
  files: Express.Multer.File[]
}


export class CreateServiceRequestMapper {
  static toDTO({ rawData, files }: CreateServiceMapperInput) {
    // ------------------------------
    //  Parse JSON
    // ------------------------------
    // const parsedServiceVariants = rawData.serviceVariants
    //   ? JSON.parse(rawData.serviceVariants)
    //   : []


    const parsedServiceVariants: ServiceVariantsType =
      rawData.serviceVariants
        ? createServiceNestedZodSchemaForServiceVariants.parse(
          JSON.parse(rawData.serviceVariants)
        )
        : []
    // const parsedPricing = rawData.pricing ? JSON.parse(rawData.pricing) : {}
    const parsedPricing: PricingType =
      createServiceNestedZodSchemaForPricing.parse(
        JSON.parse(rawData.pricing)
      )

    //const parsedSchedule = rawData.schedule ? JSON.parse(rawData.schedule) : {}
    const parsedSchedule: ScheduleType =
      createServiceNestedZodSchemaForSchedule.parse(
        JSON.parse(rawData.schedule)
      )
    // ------------------------------
    // VALIDATE NESTED STRUCTURES
    // ------------------------------
    createServiceNestedZodSchemaForServiceVariants.parse(parsedServiceVariants)
    createServiceNestedZodSchemaForPricing.parse(parsedPricing)
    createServiceNestedZodSchemaForSchedule.parse(parsedSchedule)

    // ------------------------------
    // Convert fields
    // ------------------------------
    const dailyWorkingWindows = parsedSchedule.dailyWorkingWindows || []
    const weeklyWorkingDays =
      parsedSchedule.weeklyWorkingDays?.map(Number) || []
    const monthlyWorkingDates =
      parsedSchedule.monthlyWorkingDates?.map(Number) || []

    const overrideBlock =
      parsedSchedule.overrideBlock?.map((b) => ({
        startDateTime: new Date(b.startDateTime),
        endDateTime: new Date(b.endDateTime),
        reason: b.reason ?? '',
      })) || []

    const overrideCustom =
      parsedSchedule.overrideCustom?.map((c) => ({
        startDateTime: new Date(c.startDateTime),
        endDateTime: new Date(c.endDateTime),
        startTime: c.startTime,
        endTime: c.endTime,
      })) || []

    // ------------------------------
    // Main Image
    // ------------------------------
    const mainImage = files?.[0] || null

    // ------------------------------
    //  Final DTO
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
