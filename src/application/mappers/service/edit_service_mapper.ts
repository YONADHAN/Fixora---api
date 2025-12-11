// import {
//   editServiceNestedZodSchemaForPricing,
//   editServiceNestedZodSchemaForSchedule,
//   editServiceNestedZodSchemaForServiceVariants,
// } from '../../../presentation/validations/service/edit_service.schema'
import { recurrenceType } from '../../../shared/constants'
interface editServiceRequestMapperDTO {
  vendorId: string
  serviceId: string
  subServiceCategoryId: string
  name: string
  description?: string

  // ✅ FLATTENED pricing
  'pricing.pricePerSlot': string
  'pricing.advanceAmountPerSlot': string

  // ✅ FLATTENED schedule
  'schedule.visibilityStartDate': string
  'schedule.visibilityEndDate': string
  'schedule.dailyWorkingWindows[0].startTime': string
  'schedule.dailyWorkingWindows[0].endTime': string
  'schedule.slotDurationMinutes': string
  'schedule.recurrenceType': string

  // ✅ FILES (PATCH SAFE)
  files?: Express.Multer.File[]
}
export class EditServiceRequestMapper {
  static toDTO(payload: editServiceRequestMapperDTO) {
    const mainImage = payload.files?.[0] // ✅ optional

    return {
      serviceId: payload.serviceId,
      vendorId: payload.vendorId,
      subServiceCategoryId: payload.subServiceCategoryId,

      name: payload.name,
      description: payload.description ?? '',

      pricing: {
        pricePerSlot: Number(payload['pricing.pricePerSlot']),
        advanceAmountPerSlot: Number(payload['pricing.advanceAmountPerSlot']),
      },

      mainImage, // ✅ optional for edit

      schedule: {
        visibilityStartDate: new Date(payload['schedule.visibilityStartDate']),

        visibilityEndDate: new Date(payload['schedule.visibilityEndDate']),

        dailyWorkingWindows: [
          {
            startTime: payload['schedule.dailyWorkingWindows[0].startTime'],
            endTime: payload['schedule.dailyWorkingWindows[0].endTime'],
          },
        ],

        slotDurationMinutes: Number(payload['schedule.slotDurationMinutes']),

        recurrenceType: payload['schedule.recurrenceType'] as recurrenceType,

        weeklyWorkingDays: [],
        monthlyWorkingDates: [],
        overrideBlock: [],
        overrideCustom: [],
      },
    }
  }
}
